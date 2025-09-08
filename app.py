# app.py
# RECRUITEDGE COMPLETE IMPLEMENTATION - PDL OPTIMIZED WITH FREE AND PRO TIERS ONLY
# Simplified to two tiers: Free (8 emails, 120 credits) and Pro (56 emails, 840 credits)

import os
import json
import requests
import datetime
import csv
from io import StringIO
import base64
from email.mime.text import MIMEText
import pickle
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
import PyPDF2
import tempfile
import re
from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import traceback
import firebase_admin
from firebase_admin import credentials, firestore

from dotenv import load_dotenv
from openai import OpenAI   # new SDK import
import sqlite3
from contextlib import contextmanager
from email_templates import TEMPLATES_15

# Load environment variables from .env
load_dotenv()

# Grab API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

# Replace them with these lines:
PEOPLE_DATA_LABS_API_KEY = os.getenv('PEOPLE_DATA_LABS_API_KEY')

# Add this validation
if not PEOPLE_DATA_LABS_API_KEY:
    print("WARNING: PEOPLE_DATA_LABS_API_KEY not found in .env file")

if not OPENAI_API_KEY:
    print("WARNING: OPENAI_API_KEY not found in .env file")

# Initialize Firebase
try:
    cred = credentials.Certificate('./firebase-creds.json')
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("✅ Firebase initialized successfully")
except Exception as e:
    print(f"❌ Firebase initialization failed: {e}")
    db = None

# Initialize Flask app
app = Flask(__name__)
CORS(app, origins=["https://d33d83bb2e38.ngrok-free.app", "*"])

DB_PATH = os.path.join(os.path.dirname(__file__), 'contacts.db')

@contextmanager
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    with get_db() as db:
        db.execute("""
        CREATE TABLE IF NOT EXISTS contacts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_email TEXT NOT NULL,
          first_name TEXT,
          last_name TEXT,
          linkedin TEXT,
          email TEXT,
          title TEXT,
          company TEXT,
          city TEXT,
          state TEXT,
          college TEXT,
          phone TEXT,
          personal_email TEXT,
          work_email TEXT,
          social_profiles TEXT,
          education_top TEXT,
          volunteer_history TEXT,
          work_summary TEXT,
          grp TEXT,
          hometown TEXT,
          similarity TEXT,
          status TEXT DEFAULT 'Not Contacted',
          first_contact_date TEXT,
          last_contact_date TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
        """)
        db.execute("CREATE INDEX IF NOT EXISTS idx_contacts_user_email ON contacts(user_email);")
        db.execute("CREATE INDEX IF NOT EXISTS idx_contacts_linkedin ON contacts(linkedin);")
        db.commit()

def normalize_contact(c: dict) -> dict:
    today = datetime.date.today().strftime("%m/%d/%Y")
    return {
      'FirstName': c.get('FirstName',''),
      'LastName': c.get('LastName',''),
      'LinkedIn': c.get('LinkedIn',''),
      'Email': c.get('Email',''),
      'Title': c.get('Title',''),
      'Company': c.get('Company',''),
      'City': c.get('City',''),
      'State': c.get('State',''),
      'College': c.get('College',''),
      'Phone': c.get('Phone',''),
      'PersonalEmail': c.get('PersonalEmail',''),
      'WorkEmail': c.get('WorkEmail',''),
      'SocialProfiles': c.get('SocialProfiles',''),
      'EducationTop': c.get('EducationTop',''),
      'VolunteerHistory': c.get('VolunteerHistory',''),
      'WorkSummary': c.get('WorkSummary',''),
      'Group': c.get('Group',''),
      'Hometown': c.get('Hometown',''),
      'Similarity': c.get('Similarity',''),
      'Status': c.get('Status','Not Contacted'),
      'FirstContactDate': c.get('FirstContactDate', today),
      'LastContactDate': c.get('LastContactDate', today),
    }

def save_contacts_sqlite(user_email: str, contacts: list) -> int:
    if not user_email or not contacts:
        return 0
    rows = [normalize_contact(c) for c in contacts]
    with get_db() as db:
        cur = db.cursor()
        for r in rows:
            existing = cur.execute("""
              SELECT id FROM contacts WHERE user_email=? AND
                (linkedin=? AND linkedin<>'') OR (email=? AND email<>'')
            """, (user_email, r['LinkedIn'], r['Email'])).fetchone()
            if existing:
                continue
            cur.execute("""
              INSERT INTO contacts (
                user_email, first_name, last_name, linkedin, email, title, company, city, state, college,
                phone, personal_email, work_email, social_profiles, education_top, volunteer_history,
                work_summary, grp, hometown, similarity, status, first_contact_date, last_contact_date
              ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            """, (
              user_email, r['FirstName'], r['LastName'], r['LinkedIn'], r['Email'], r['Title'], r['Company'],
              r['City'], r['State'], r['College'], r['Phone'], r['PersonalEmail'], r['WorkEmail'],
              r['SocialProfiles'], r['EducationTop'], r['VolunteerHistory'], r['WorkSummary'],
              r['Group'], r['Hometown'], r['Similarity'], r['Status'], r['FirstContactDate'], r['LastContactDate']
            ))
        db.commit()
        return cur.rowcount or 0

def list_contacts_sqlite(user_email: str) -> list:
    if not user_email:
        return []
    with get_db() as db:
        rows = db.execute("""
          SELECT id, user_email, first_name, last_name, linkedin, email, title, company, city, state,
                 college, phone, personal_email, work_email, social_profiles, education_top, volunteer_history,
                 work_summary, grp, hometown, similarity, status, first_contact_date, last_contact_date, created_at
          FROM contacts WHERE user_email=? ORDER BY created_at DESC
        """, (user_email,)).fetchall()
        return [dict(r) for r in rows]

# PDL Configuration with your API key

PDL_BASE_URL = 'https://api.peopledatalabs.com/v5'


# TIER CONFIGURATIONS - SIMPLIFIED TO TWO TIERS
TIER_CONFIGS = {
    'free': {
        'max_contacts': 8,  # 8 emails = 120 credits (15 credits per email)
        'fields': ['FirstName', 'LastName', 'LinkedIn', 'Email', 'Title', 'Company', 'City', 'State', 'College', 'email_subject', 'email_body', 'draft_id'],
        'uses_pdl': True,
        'uses_email_drafting': True,
        'uses_resume': False,
        'credits': 120,
        'time_saved_minutes': 200,  # 8 emails * 25 minutes each
        'description': 'Try out platform risk free'
    },
    'pro': {
        'max_contacts': 56,  # 56 emails = 840 credits (15 credits per email)
        'fields': ['FirstName', 'LastName', 'LinkedIn', 'Email', 'Title', 'Company', 'City', 'State', 'College',
                  'Phone', 'PersonalEmail', 'WorkEmail', 'SocialProfiles', 'EducationTop', 'VolunteerHistory',
                  'WorkSummary', 'Group', 'Hometown', 'Similarity', 'email_subject', 'email_body', 'draft_id'],
        'uses_pdl': True,
        'uses_email_drafting': True,
        'uses_resume': True,
        'credits': 840,
        'time_saved_minutes': 1200,  # 56 emails * ~21 minutes each (more efficient at scale)
        'description': 'Everything in free plus advanced features'
    }
}

# PDL Major Metro Areas (based on PDL documentation)
PDL_METRO_AREAS = {
    'san francisco': 'san francisco, california',
    'san francisco bay area': 'san francisco, california',
    'bay area': 'san francisco, california',
    'sf': 'san francisco, california',
    'los angeles': 'los angeles, california',
    'la': 'los angeles, california',
    'new york': 'new york, new york',
    'new york city': 'new york, new york',
    'nyc': 'new york, new york',
    'chicago': 'chicago, illinois',
    'boston': 'boston, massachusetts',
    'washington dc': 'washington, district of columbia',
    'dc': 'washington, district of columbia',
    'seattle': 'seattle, washington',
    'atlanta': 'atlanta, georgia',
    'dallas': 'dallas, texas',
    'houston': 'houston, texas',
    'miami': 'miami, florida',
    'denver': 'denver, colorado',
    'phoenix': 'phoenix, arizona',
    'philadelphia': 'philadelphia, pennsylvania',
    'detroit': 'detroit, michigan',
    'minneapolis': 'minneapolis, minnesota',
    'austin': 'austin, texas',
    'san diego': 'san diego, california',
    'portland': 'portland, oregon',
    'orlando': 'orlando, florida',
    'tampa': 'tampa, florida',
    'nashville': 'nashville, tennessee',
    'charlotte': 'charlotte, north carolina',
    'pittsburgh': 'pittsburgh, pennsylvania',
    'cleveland': 'cleveland, ohio',
    'cincinnati': 'cincinnati, ohio',
    'columbus': 'columbus, ohio',
    'indianapolis': 'indianapolis, indiana',
    'milwaukee': 'milwaukee, wisconsin',
    'kansas city': 'kansas city, missouri',
    'sacramento': 'sacramento, california',
    'las vegas': 'las vegas, nevada',
    'salt lake city': 'salt lake city, utah',
    'raleigh': 'raleigh, north carolina',
    'richmond': 'richmond, virginia',
    'birmingham': 'birmingham, alabama',
    'memphis': 'memphis, tennessee',
    'louisville': 'louisville, kentucky',
    'jacksonville': 'jacksonville, florida',
    'oklahoma city': 'oklahoma city, oklahoma',
    'buffalo': 'buffalo, new york',
    'rochester': 'rochester, new york',
    'albany': 'albany, new york',
    'hartford': 'hartford, connecticut',
    'providence': 'providence, rhode island'
}

# ========================================
# PDL CLEANER APIS (for better matching)
# ========================================

def clean_company_name(company):
    """Clean company name using PDL Cleaner API for better matching"""
    try:
        print(f"Cleaning company name: {company}")
        
        response = requests.get(
            f"{PDL_BASE_URL}/company/clean",
            params={
                'api_key': PEOPLE_DATA_LABS_API_KEY,
                'name': company
            },
            timeout=10
        )
        
        if response.status_code == 200:
            clean_data = response.json()
            if clean_data.get('status') == 200 and clean_data.get('name'):
                cleaned_name = clean_data['name']
                print(f"Cleaned company: '{company}' -> '{cleaned_name}'")
                return cleaned_name
    
    except Exception as e:
        print(f"Company cleaning failed: {e}")
    
    return company

def clean_location_name(location):
    """Clean location name using PDL Cleaner API for better matching"""
    try:
        print(f"Cleaning location: {location}")
        
        response = requests.get(
            f"{PDL_BASE_URL}/location/clean",
            params={
                'api_key': PEOPLE_DATA_LABS_API_KEY,
                'location': location
            },
            timeout=10
        )
        
        if response.status_code == 200:
            clean_data = response.json()
            if clean_data.get('status') == 200 and clean_data.get('name'):
                cleaned_location = clean_data['name']
                print(f"Cleaned location: '{location}' -> '{cleaned_location}'")
                return cleaned_location
    
    except Exception as e:
        print(f"Location cleaning failed: {e}")
    
    return location

# ========================================
# ENHANCED PDL APIS
# ========================================

def enrich_job_title_with_pdl(job_title):
    """Use PDL Job Title Enrichment API to get standardized job titles"""
    try:
        print(f"Enriching job title: {job_title}")
        
        response = requests.get(
            f"{PDL_BASE_URL}/job_title/enrich",
            params={
                'api_key': PEOPLE_DATA_LABS_API_KEY,
                'job_title': job_title
            },
            timeout=10
        )
        
        if response.status_code == 200:
            enrich_data = response.json()
            if enrich_data.get('status') == 200 and enrich_data.get('data'):
                enriched_data = enrich_data['data']
                
                # Extract useful enrichment data
                result = {
                    'cleaned_name': enriched_data.get('cleaned_name', job_title),
                    'similar_titles': enriched_data.get('similar_job_titles', []),
                    'levels': enriched_data.get('job_title_levels', []),
                    'categories': enriched_data.get('job_title_categories', [])
                }
                
                print(f"Job title enrichment successful: {result}")
                return result
    
    except Exception as e:
        print(f"Job title enrichment failed: {e}")
    
    return {
        'cleaned_name': job_title,
        'similar_titles': [],
        'levels': [],
        'categories': []
    }

def get_autocomplete_suggestions(query, data_type='job_title'):
    """Enhanced autocomplete with proper PDL field mapping"""
    try:
        print(f"Getting autocomplete suggestions for {data_type}: {query}")
        
        # Map your frontend field names to PDL's supported field names
        pdl_field_mapping = {
            'job_title': 'title',  # This is the key fix
            'company': 'company',
            'location': 'location',
            'school': 'school',
            'skill': 'skill',
            'industry': 'industry',
            'role': 'role',
            'sub_role': 'sub_role'
        }
        
        # Get the correct PDL field name
        pdl_field = pdl_field_mapping.get(data_type, data_type)
        
        print(f"Mapping {data_type} -> {pdl_field} for PDL API")
        
        response = requests.get(
            f"{PDL_BASE_URL}/autocomplete",
            params={
                'api_key': PEOPLE_DATA_LABS_API_KEY,
                'field': pdl_field,  # Use the mapped field name
                'text': query,
                'size': 10
            },
            timeout=15
        )
        
        print(f"PDL autocomplete response: {response.status_code}")
        
        if response.status_code == 200:
            auto_data = response.json()
            if auto_data.get('status') == 200 and auto_data.get('data'):
                suggestions = auto_data['data']
                print(f"Autocomplete suggestions: {suggestions}")
                return suggestions
            else:
                print(f"PDL autocomplete no data: {auto_data}")
                return []
        
        elif response.status_code == 400:
            try:
                error_data = response.json()
                print(f"PDL autocomplete error 400: {error_data}")
                if isinstance(error_data, dict) and 'error' in error_data:
                    msg = error_data['error'].get('message', '')
                    if 'Supported fields are' in msg:
                        print(f"Available fields: {msg}")
            except Exception:
                pass
            return []
        elif response.status_code == 402:
            print("PDL API: Payment required for autocomplete")
            return []
        elif response.status_code == 429:
            print("PDL API rate limited for autocomplete")
            return []
        else:
            print(f"PDL autocomplete error {response.status_code}: {response.text}")
            return []
    
    except requests.exceptions.Timeout:
        print(f"Autocomplete timeout for {data_type}: {query}")
        return []
    except Exception as e:
        print(f"Autocomplete exception for {data_type}: {e}")
        return []

# ========================================
# SMART LOCATION STRATEGY
# ========================================

def determine_location_strategy(location_input):
    """Determine whether to use metro or locality search based on input location"""
    try:
        location_lower = location_input.lower().strip()
        
        # Parse input location
        if ',' in location_lower:
            parts = [part.strip() for part in location_lower.split(',')]
            city = parts[0]
            state = parts[1] if len(parts) > 1 else None
        else:
            city = location_lower
            state = None
        
        # Check if this location maps to a PDL metro area
        metro_key = None
        metro_location = None
        
        # Direct match check
        if city in PDL_METRO_AREAS:
            metro_key = city
            metro_location = PDL_METRO_AREAS[city]
        
        # Also check full location string
        elif location_lower in PDL_METRO_AREAS:
            metro_key = location_lower
            metro_location = PDL_METRO_AREAS[location_lower]
        
        # Check for partial matches (e.g., "san francisco, ca" matches "san francisco")
        else:
            for metro_name in PDL_METRO_AREAS:
                if metro_name in city or city in metro_name:
                    metro_key = metro_name
                    metro_location = PDL_METRO_AREAS[metro_name]
                    break
        
        if metro_location:
            return {
                'strategy': 'metro_primary',
                'metro_location': metro_location,
                'city': city,
                'state': state,
                'original_input': location_input,
                'matched_metro': metro_key
            }
        else:
            return {
                'strategy': 'locality_primary',
                'metro_location': None,
                'city': city,
                'state': state,
                'original_input': location_input,
                'matched_metro': None
            }
            
    except Exception as e:
        print(f"Error determining location strategy: {e}")
        return {
            'strategy': 'locality_primary',
            'metro_location': None,
            'city': location_input,
            'state': None,
            'original_input': location_input,
            'matched_metro': None
        }

# ========================================
# ENHANCED PDL SEARCH IMPLEMENTATION
# ========================================

def search_contacts_with_smart_location_strategy(job_title, company, location, max_contacts=8):
    """Enhanced search that intelligently chooses metro vs locality based on location input"""
    try:
        print(f"Starting smart location search for {job_title} at {company} in {location}")
        
        # Step 1: Enrich job title
        job_title_enrichment = enrich_job_title_with_pdl(job_title)
        primary_title = job_title_enrichment['cleaned_name']
        similar_titles = job_title_enrichment['similar_titles'][:3]
        
        # Step 2: Clean company
        cleaned_company = clean_company_name(company) if company else ''
        
        # Step 3: Clean and analyze location
        cleaned_location = clean_location_name(location)
        location_strategy = determine_location_strategy(cleaned_location)
        
        print(f"Location strategy: {location_strategy['strategy']}")
        if location_strategy['matched_metro']:
            print(f"Matched metro: {location_strategy['matched_metro']} -> {location_strategy['metro_location']}")
        
        # Step 4: Execute search based on determined strategy
        if location_strategy['strategy'] == 'metro_primary':
            # Use metro search for major metro areas
            contacts = try_metro_search_optimized(
                primary_title, similar_titles, cleaned_company,
                location_strategy, max_contacts
            )
            
            # If metro results are insufficient, add locality results
            if len(contacts) < max_contacts // 2:
                print(f"Metro results insufficient ({len(contacts)}), adding locality results")
                locality_contacts = try_locality_search_optimized(
                    primary_title, similar_titles, cleaned_company,
                    location_strategy, max_contacts - len(contacts)
                )
                contacts.extend([c for c in locality_contacts if c not in contacts])
        
        else:
            # Use locality search for non-metro areas
            contacts = try_locality_search_optimized(
                primary_title, similar_titles, cleaned_company,
                location_strategy, max_contacts
            )
            
            # If locality results are insufficient, try broader search
            if len(contacts) < max_contacts // 2:
                print(f"Locality results insufficient ({len(contacts)}), trying broader search")
                broader_contacts = try_job_title_levels_search_enhanced(
                    job_title_enrichment, cleaned_company,
                    location_strategy['city'], location_strategy['state'],
                    max_contacts - len(contacts)
                )
                contacts.extend([c for c in broader_contacts if c not in contacts])
        
        print(f"Smart location search completed: {len(contacts)} contacts found")
        return contacts[:max_contacts]
        
    except Exception as e:
        print(f"Smart location search failed: {e}")
        return []

def try_metro_search_optimized(primary_title, similar_titles, company, location_strategy, max_contacts):
    """Fixed metro search - removes invalid minimum_should_match"""
    try:
        print(f"Metro search for: {location_strategy['metro_location']}")
        
        must_clauses = []
        
        # Simple job title matching - NO minimum_should_match
        must_clauses.append({
            "match": {"job_title": primary_title.lower()}
        })
        
        # Company matching
        if company:
            must_clauses.append({
                "match": {"job_company_name": company.lower()}
            })
        
        # Metro location matching
        must_clauses.append({
            "match": {"location_metro": location_strategy['metro_location']}
        })
        
        # Required fields
        must_clauses.append({"exists": {"field": "emails"}})
        
        elasticsearch_query = {
            "query": {"bool": {"must": must_clauses}},
            "size": max_contacts
        }
        
        return execute_pdl_search(elasticsearch_query, f"metro_{location_strategy['matched_metro']}")
        
    except Exception as e:
        print(f"Metro search failed: {e}")
        return []

def try_locality_search_optimized(primary_title, similar_titles, company, location_strategy, max_contacts):
    """Fixed locality search - removes invalid minimum_should_match"""
    try:
        print(f"Locality search for: {location_strategy['city']}, {location_strategy['state']}")
        
        must_clauses = []
        
        # Simple job title matching - NO minimum_should_match
        must_clauses.append({
            "match": {"job_title": primary_title.lower()}
        })
        
        # Company matching
        if company:
            must_clauses.append({
                "match": {"job_company_name": company.lower()}
            })
        
        # Locality matching
        must_clauses.append({
            "match": {"location_locality": location_strategy['city'].lower()}
        })
        
        if location_strategy['state']:
            must_clauses.append({
                "match": {"location_region": location_strategy['state'].lower()}
            })
        
        # Required fields
        must_clauses.append({"exists": {"field": "emails"}})
        
        elasticsearch_query = {
            "query": {"bool": {"must": must_clauses}},
            "size": max_contacts
        }
        
        return execute_pdl_search(elasticsearch_query, f"locality_{location_strategy['city']}")
        
    except Exception as e:
        print(f"Locality search failed: {e}")
        return []

def try_job_title_levels_search_enhanced(job_title_enrichment, company, city, state, max_contacts):
    """Enhanced job title levels search using enriched data"""
    try:
        print(f"Enhanced job title levels search")
        
        must_clauses = []
        
        # Use enriched job title levels if available
        job_levels = job_title_enrichment.get('levels', [])
        if job_levels:
            level_queries = []
            for level in job_levels:
                level_queries.append({"match": {"job_title_levels": level}})
            
            must_clauses.append({
                "bool": {
                    "should": level_queries,
                    "minimum_should_match": 1
                }
            })
        else:
            # Fallback to original job level determination
            job_level = determine_job_level(job_title_enrichment['cleaned_name'])
            if job_level:
                must_clauses.append({
                    "match": {
                        "job_title_levels": job_level
                    }
                })
        
        # Company matching
        if company:
            must_clauses.append({
                "match_phrase": {"job_company_name": company.lower()}
            })
        
        # Location matching (try metro first, then locality)
        if state:
            metro_location = f"{city.lower()}, {state.lower()}"
            must_clauses.append({
                "bool": {
                    "should": [
                        {"match": {"location_metro": metro_location}},
                        {"match_phrase": {"location_region": state.lower()}}
                    ],
                    "minimum_should_match": 1
                }
            })
        else:
            must_clauses.append({
                "bool": {
                    "should": [
                        {"match": {"location_metro": city.lower()}},
                        {"match_phrase": {"location_locality": city.lower()}}
                    ],
                    "minimum_should_match": 1
                }
            })
        
        # Required fields (relaxed per PDL feedback)
        must_clauses.append({"exists": {"field": "emails"}})
        must_clauses.append({"exists": {"field": "recommended_personal_email"}})
        
        elasticsearch_query = {
            "query": {
                "bool": {
                    "must": must_clauses
                }
            },
            "size": max_contacts
        }
        
        return execute_pdl_search(elasticsearch_query, "job_levels_enhanced")
        
    except Exception as e:
        print(f"Enhanced job title levels search failed: {e}")
        return []

def determine_job_level(job_title):
    """Determine job level from job title for JOB_TITLE_LEVELS search"""
    job_title_lower = job_title.lower()
    
    if any(word in job_title_lower for word in ['intern', 'internship']):
        return 'intern'
    elif any(word in job_title_lower for word in ['entry', 'junior', 'associate', 'coordinator']):
        return 'entry'
    elif any(word in job_title_lower for word in ['senior', 'lead', 'principal']):
        return 'senior'
    elif any(word in job_title_lower for word in ['manager', 'director', 'head']):
        return 'manager'
    elif any(word in job_title_lower for word in ['vp', 'vice president', 'executive', 'chief']):
        return 'executive'
    else:
        return 'mid'  # Default to mid-level

def execute_pdl_search(elasticsearch_query, search_type):
    """Execute the actual PDL search and process results"""
    try:
        query_json = json.dumps(elasticsearch_query)
        search_params = {
            'api_key': PEOPLE_DATA_LABS_API_KEY,
            'query': query_json,
            'pretty': 'true'
        }
        
        print(f"Executing {search_type} search")
        
        response = requests.get(
            f"{PDL_BASE_URL}/person/search",
            params=search_params,
            timeout=15
        )
        
        print(f"{search_type.title()} search response: {response.status_code}")
        
        if response.status_code == 200:
            search_data = response.json()
            
            if search_data.get('status') == 200 and search_data.get('data'):
                people_data = search_data['data']
                print(f"{search_type.title()} search found {len(people_data)} people")
                
                contacts = []
                for person in people_data:
                    contact = extract_contact_from_pdl_person_optimized(person)
                    if contact:
                        contacts.append(contact)
                
                return contacts
        
        elif response.status_code == 402:
            print(f"PDL API: Payment required for {search_type} search")
        elif response.status_code == 429:
            print(f"PDL API rate limited for {search_type} search")
        else:
            print(f"{search_type.title()} search error {response.status_code}: {response.text}")
        
        return []
        
    except Exception as e:
        print(f"{search_type.title()} search execution failed: {e}")
        return []

def extract_contact_from_pdl_person_optimized(person):
    """Extract contact info with focus on recommended_personal_email and correct field mappings"""
    try:
        # Basic info
        first_name = person.get('first_name', '')
        last_name = person.get('last_name', '')
        
        if not first_name or not last_name:
            return None
        
        # Get current job from experience array
        experience = person.get('experience', [])
        current_job = experience[0] if experience else {}
        
        # Extract company and title
        company_info = current_job.get('company', {})
        title_info = current_job.get('title', {})
        
        company_name = company_info.get('name', '') if isinstance(company_info, dict) else ''
        job_title = title_info.get('name', '') if isinstance(title_info, dict) else ''
        
        # Get location using correct field structure
        location_info = person.get('location', {})
        city = location_info.get('locality', '') if isinstance(location_info, dict) else ''
        state = location_info.get('region', '') if isinstance(location_info, dict) else ''
        
        # FOCUS ON recommended_personal_email (17.9% fill rate - highest quality emails)
        primary_email = person.get('recommended_personal_email', '')
        
        # Get other emails as fallback
        emails = person.get('emails', [])
        personal_email = ''
        work_email = ''
        
        if isinstance(emails, list) and emails:
            for email in emails:
                if isinstance(email, dict):
                    email_address = email.get('address', '')
                    email_type = email.get('type', '')
                    
                    if email_type == 'work':
                        work_email = email_address
                    elif email_type == 'personal':
                        personal_email = email_address
        
        # Prioritize recommended_personal_email (PDL's highest quality email)
        if not primary_email:
            primary_email = personal_email or work_email
        
        # Get phone
        phone_numbers = person.get('phone_numbers', [])
        phone = phone_numbers[0] if isinstance(phone_numbers, list) and phone_numbers else ''
        
        # Get LinkedIn
        profiles = person.get('profiles', [])
        linkedin_url = ''
        
        if isinstance(profiles, list):
            for profile in profiles:
                if isinstance(profile, dict) and 'linkedin' in profile.get('network', '').lower():
                    linkedin_url = profile.get('url', '')
                    break
        
        # Get education
        education = person.get('education', [])
        education_text = []
        
        if isinstance(education, list):
            for edu in education[:2]:
                if isinstance(edu, dict):
                    school_info = edu.get('school', {})
                    if isinstance(school_info, dict):
                        school_name = school_info.get('name', '')
                        degrees = edu.get('degrees', [])
                        degree = degrees[0] if isinstance(degrees, list) and degrees else ''
                        
                        if school_name:
                            if degree:
                                education_text.append(f"{school_name} - {degree}")
                            else:
                                education_text.append(school_name)
        
        education_string = '; '.join(education_text) if education_text else 'Not available'
        
        # Build optimized contact object with correct field mappings
        contact = {
            'FirstName': first_name,
            'LastName': last_name,
            'LinkedIn': linkedin_url,
            'Email': primary_email,  # This prioritizes recommended_personal_email
            'Title': job_title,
            'Company': company_name,
            'City': city,
            'State': state,
            'College': education_string,
            'Phone': phone,
            'PersonalEmail': person.get('recommended_personal_email', personal_email),  # Highlight PDL's best email
            'WorkEmail': work_email or 'Not available',
            'SocialProfiles': f'LinkedIn: {linkedin_url}' if linkedin_url else 'Not available',
            'EducationTop': education_string,
            'LinkedInConnections': person.get('linkedin_connections', 0),  # Track connection count
            'DataVersion': person.get('dataset_version', 'Unknown')  # Track data freshness
        }
        
        # Add additional enrichment
        add_pdl_enrichment_fields_optimized(contact, person)
        
        return contact
        
    except Exception as e:
        print(f"Failed to extract optimized contact: {e}")
        return None

def add_pdl_enrichment_fields_optimized(contact, person_data):
    """Add enrichment fields based on your product specifications"""
    try:
        # Work summary using experience array (36.8% fill rate)
        experience = person_data.get('experience', [])
        if isinstance(experience, list) and experience:
            current_job = experience[0]
            if isinstance(current_job, dict):
                title_info = current_job.get('title', {})
                company_info = current_job.get('company', {})
                
                title = title_info.get('name', contact.get('Title', '')) if isinstance(title_info, dict) else contact.get('Title', '')
                company = company_info.get('name', contact.get('Company', '')) if isinstance(company_info, dict) else contact.get('Company', '')
                
                work_summary = f"Current {title} at {company}"
                
                # Add years of experience if available (17.5% fill rate)
                years_exp = person_data.get('inferred_years_experience')
                if years_exp:
                    work_summary += f" ({years_exp} years experience)"
                
                if len(experience) > 1:
                    prev_job = experience[1]
                    if isinstance(prev_job, dict):
                        prev_company_info = prev_job.get('company', {})
                        if isinstance(prev_company_info, dict):
                            prev_company = prev_company_info.get('name', '')
                            if prev_company:
                                work_summary += f". Previously at {prev_company}"
                
                contact['WorkSummary'] = work_summary
        else:
            contact['WorkSummary'] = f"Professional at {contact.get('Company', 'current company')}"
        
        # Volunteer History from interests (4.2% fill rate)
        interests = person_data.get('interests', [])
        if isinstance(interests, list) and interests:
            volunteer_activities = []
            for interest in interests[:3]:  # Top 3 interests
                if isinstance(interest, str):
                    volunteer_activities.append(f"{interest} enthusiast")
            
            contact['VolunteerHistory'] = '; '.join(volunteer_activities) if volunteer_activities else 'Not available'
        else:
            contact['VolunteerHistory'] = 'Not available'
        
        # Group/Department (as per your spec)
        contact['Group'] = f"{contact.get('Company', 'Company')} {contact.get('Title', '').split()[0] if contact.get('Title') else 'Professional'} Team"
        
    except Exception as e:
        print(f"Error adding enrichment fields: {e}")

# Update the main search wrapper
def search_contacts_with_pdl_optimized(job_title, company, location, max_contacts=8):
    """Updated main search function using smart location strategy"""
    return search_contacts_with_smart_location_strategy(job_title, company, location, max_contacts)

# ========================================
# EMAIL GENERATION (Free & Pro Tiers)
# ========================================

def generate_email_from_templates(resume_text: str, contact_info: dict, templates: list, user_name: str = "", user_email: str = "", user_phone: str = "", temperature: float = 0.7) -> str:
    """
    Uses the user's unified prompt to select one best template and return a final polished email body.
    Returns the email body only (no subject).
    """
    system_prompt = (
        "You are an expert career networking assistant trained to generate professional, "
        "personalized cold outreach emails for coffee chats and networking."
    )

    user_prompt = f"""
You are an expert career networking assistant trained to generate professional, personalized cold outreach emails for coffee chats and networking.
1. From a library of 15 pre-written outreach templates, select the single most appropriate template given:
   - The user's resume (background, education, experiences, goals).
   - The contact's profile (from People Data Labs: role, company, school, skills, industry, location).
   - The nature of their commonalities (e.g., same school, same club, same hometown, shared interests, career transitions, or company admiration).
2. Reconcile and merge the most relevant overlapping details between the user's resume and the contact's information to personalize the chosen template. This includes:
   - Education overlaps (same school/degree/club/activities).
   - Career overlaps (similar industries, roles, or transitions).
   - Geographic overlaps (same city, hometown, office).
   - Aspirational overlaps (the user's career goals aligning with the contact's path).
3. Fill in the personalization slots in the chosen template. Do this subtly and naturally, without overloading the email with excessive detail. Mention one or two very specific similarities or points of admiration that connect the user to the contact.
- Always keep the tone professional, respectful, and concise.
- Emphasize gratitude and the ask for a 15–20 minute call or coffee chat.
- Do not simply merge the resume with the contact's profile — instead, use only the most relevant overlaps to establish credibility and authenticity.
- Never overstuff the email with too much detail. Limit to 1–2 personalizing sentences.
- Always sign off with the user's name and contact info.
- Replace [Your Name]/[Your Full Name] with: {user_name or "[Your Name]"}
- Replace [Your Email] with: {user_email or "[Your Email]"}
- Replace [Your Phone Number] with: {user_phone or "[Your Phone Number]"}
- resume_text = {json.dumps(resume_text, ensure_ascii=False)}
- contact_info = {json.dumps(contact_info, ensure_ascii=False)}
- templates = {json.dumps(templates, ensure_ascii=False)}
- user = {{"name": {json.dumps(user_name)}, "email": {json.dumps(user_email)}, "phone": {json.dumps(user_phone)}}}
Return a final polished cold outreach email that:
1. Uses the single best-fitting template.
2. Seamlessly incorporates personal similarities between the user and contact.
3. Reads as if the user wrote it specifically for this contact.
Do not return multiple templates or drafts. Only return the final single email.
"""

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        max_tokens=700,
        temperature=temperature,
    )
    return response.choices[0].message.content.strip()

def generate_email_for_tier(contact, tier='free', resume_info=None, similarity=None, hometown=None, user_name="", user_email="", user_phone=""):
    """Generate email based on tier - Free or Pro"""
    try:
        print(f"Generating {tier} email for {contact.get('FirstName', 'Unknown')}")
        
        if tier == 'free':
            return generate_free_email(contact, user_name, user_email, user_phone)
        elif tier == 'pro':
            return generate_pro_email(contact, resume_info, similarity, hometown, user_name=user_name, user_email=user_email, user_phone=user_phone)
        else:
            # Fallback to free email
            return generate_free_email(contact, user_name, user_email, user_phone)
            
    except Exception as e:
        print(f"{tier.capitalize()} email generation failed: {e}")
        return f"Quick Chat about Your Work at {contact.get('Company', 'Your Company')}?", f"Hi {contact.get('FirstName', '')},\n\nI'd love to learn more about your work at {contact.get('Company', '')}. Would you be open to a brief chat?\n\nBest regards"

def generate_free_email(contact, user_name="", user_email="", user_phone=""):
    """Generate Free tier email using template-selection prompt (no resume)."""
    try:
        contact_info = {
            "first_name": contact.get("FirstName"),
            "last_name": contact.get("LastName"),
            "title": contact.get("Title"),
            "company": contact.get("Company"),
            "city": contact.get("City"),
            "state": contact.get("State"),
            "education": contact.get("EducationTop"),
            "skills": contact.get("Skills") or [],
            "industry": contact.get("Industry") or contact.get("PDLIndustry"),
            "location": ", ".join([p for p in [contact.get("City"), contact.get("State")] if p]),
        }

        resume_text = ""

        email_body = generate_email_from_templates(
            resume_text=resume_text,
            contact_info=contact_info,
            templates=TEMPLATES_15,
            user_name=user_name,
            user_email=user_email,
            user_phone=user_phone,
            temperature=0.7,
        )
        
        if user_name:
            email_body = email_body.replace("[Your Name]", user_name).replace("[Your Full Name]", user_name)
        if user_email:
            email_body = email_body.replace("[Your Email]", user_email)
        if user_phone:
            email_body = email_body.replace("[Your Phone Number]", user_phone)

        email_subject = f"Coffee chat re: {contact.get('Title', 'your work')} @ {contact.get('Company', 'your company')}?"

        return email_subject, email_body

    except Exception as e:
        print(f"Free email generation failed: {e}")
        return f"Coffee chat about your work at {contact.get('Company', 'your company')}?", (
            f"Hi {contact.get('FirstName', '')},\n\nI'd love to learn more about your work at "
            f"{contact.get('Company', '')}. Would you be open to a brief chat?\n\nBest regards"
        )

def generate_pro_email(contact, resume_info, similarity, hometown, user_name="", user_email="", user_phone=""):
    """Generate Pro tier email (uses structured profile summary derived from resume)."""
    try:
        resume_name = (resume_info or {}).get("name") or user_name or ""
        resume_email = (resume_info or {}).get("email") or user_email or ""
        resume_phone = (resume_info or {}).get("phone") or user_phone or ""
        
        resume_summary = {
            "name": resume_name,
            "year": resume_info.get("year", ""),
            "major": resume_info.get("major", ""),
            "university": resume_info.get("university", ""),
            "hometown": hometown or "",
            "similarity_summary": similarity or "",
        }
        resume_text = json.dumps(resume_summary, ensure_ascii=False)

        contact_info = {
            "first_name": contact.get("FirstName"),
            "last_name": contact.get("LastName"),
            "title": contact.get("Title"),
            "company": contact.get("Company"),
            "city": contact.get("City"),
            "state": contact.get("State"),
            "education": contact.get("EducationTop"),
            "skills": contact.get("Skills") or [],
            "industry": contact.get("Industry") or contact.get("PDLIndustry"),
            "location": ", ".join([p for p in [contact.get("City"), contact.get("State")] if p]),
        }

        email_body = generate_email_from_templates(
            resume_text=resume_text,
            contact_info=contact_info,
            templates=TEMPLATES_15,
            user_name=resume_name,
            user_email=resume_email,
            user_phone=resume_phone,
            temperature=0.7,
        )
        
        if resume_name:
            email_body = email_body.replace("[Your Name]", resume_name).replace("[Your Full Name]", resume_name)
        if resume_email:
            email_body = email_body.replace("[Your Email]", resume_email)
        if resume_phone:
            email_body = email_body.replace("[Your Phone Number]", resume_phone)

        subject_prompt = f"""
Create a concise, compelling subject for a coffee chat outreach email.
Consider: {contact.get('FirstName','')} at {contact.get('Company','')}, role {contact.get('Title','')},
and any alumni/location fit if obvious. Output only the subject line.
Email body (first 300 chars): {email_body[:300]}...
"""
        subject_response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You write concise, effective email subject lines with subtle personalization."},
                {"role": "user", "content": subject_prompt},
            ],
            max_tokens=40,
            temperature=0.7,
        )
        email_subject = subject_response.choices[0].message.content.strip().strip('"').strip("'")

        return email_subject, email_body

    except Exception as e:
        print(f"Pro email generation failed: {e}")
        return f"Coffee chat about your work at {contact.get('Company', 'your company')}?", (
            f"Hi {contact.get('FirstName', '')},\n\nI'd love to learn more about your work at "
            f"{contact.get('Company', '')}. Would you be open to a brief chat?\n\nBest regards"
        )

# ========================================
# PRO TIER - RESUME PROCESSING
# ========================================

def extract_text_from_pdf(pdf_file):
    """Extract text from PDF using PyPDF2 with improved encoding handling"""
    try:
        print("Extracting text from PDF...")
        
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            pdf_file.save(temp_file.name)
            
            with open(temp_file.name, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                
                for page in pdf_reader.pages:
                    page_text = page.extract_text()
                    # Clean and encode the text properly
                    if page_text:
                        # Remove non-printable characters and fix encoding issues
                        cleaned_text = ''.join(char for char in page_text if char.isprintable() or char.isspace())
                        # Normalize unicode characters
                        cleaned_text = cleaned_text.encode('utf-8', errors='ignore').decode('utf-8')
                        text += cleaned_text + "\n"
            
            os.unlink(temp_file.name)
            
            # Final cleanup - remove extra whitespace and normalize
            text = ' '.join(text.split())
            
            print(f"Extracted {len(text)} characters from PDF")
            return text.strip() if text.strip() else None
            
    except Exception as e:
        print(f"PDF text extraction failed: {e}")
        return None

def parse_resume_info(resume_text):
    """Extract user information from resume text with improved error handling"""
    try:
        print("Parsing resume information...")
        
        if not resume_text or len(resume_text.strip()) < 10:
            print("Resume text is too short or empty")
            return {
                "name": "[Your Name]",
                "year": "[Your Year]",
                "major": "[Your Major]",
                "university": "[Your University]"
            }
        
        # Clean the resume text for JSON processing
        clean_text = resume_text.replace('"', "'").replace('\n', ' ').replace('\r', ' ')
        clean_text = ' '.join(clean_text.split())  # Normalize whitespace
        
        # Truncate to avoid token limits
        if len(clean_text) > 1500:
            clean_text = clean_text[:1500] + "..."
        
        prompt = f"""
Extract the following information from this resume text:
- Full Name
- Email Address (personal or professional email)
- Phone Number (format as provided, e.g., "(555) 123-4567" or "555-123-4567")
- Graduation Year (extract the 4-digit year from graduation date, e.g., "2022", "2023", "2024")
- Major/Field of Study
- University/School name

Return as JSON format:
{{
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "(555) 123-4567",
    "year": "2022",
    "major": "Major/Field",
    "university": "University Name"
}}

If any field is not found, use an empty string "" for that field.

Resume text:
{clean_text}
"""
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert at extracting structured information from resumes. Return only valid JSON with no extra text."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.3
        )
        
        response_text = response.choices[0].message.content.strip()
        
        # Try to extract JSON from response
        try:
            # Remove any markdown formatting
            if '```' in response_text:
                response_text = response_text.split('```')[1]
                if response_text.startswith('json'):
                    response_text = response_text[4:]
            
            result = json.loads(response_text)
            
            # Validate the result has required fields
            required_fields = ['name', 'email', 'phone', 'year', 'major', 'university']
            for field in required_fields:
                if field not in result:
                    result[field] = ""
                elif not result[field] or result[field] in ['Unknown', 'N/A', 'n/a']:
                    result[field] = ""
            
            if result['year'] and result['year'] != "[Your Year]":
                year_match = re.search(r'\b(19|20)\d{2}\b', result['year'])
                if year_match:
                    result['year'] = year_match.group()
                elif result['year'].lower() in ['graduated', 'unknown', 'n/a']:
                    result['year'] = ""
            
            print(f"Parsed resume info: {result['name']} ({result['email']}, {result['phone']}) - {result['year']} {result['major']} at {result['university']}")
            return result
            
        except json.JSONDecodeError as je:
            print(f"JSON parsing failed: {je}")
            print(f"Response was: {response_text}")
            
            # Fallback: try to extract info using regex
            return extract_resume_info_fallback(clean_text)
        
    except Exception as e:
        print(f"Resume parsing failed: {e}")
        return {
            "name": "",
            "email": "",
            "phone": "",
            "year": "",
            "major": "",
            "university": ""
        }

def extract_resume_info_fallback(text):
    """Fallback method to extract resume info using regex patterns"""
    try:
        print("Using fallback regex extraction...")
        
        import re
        
        result = {
            "name": "",
            "email": "",
            "phone": "",
            "year": "",
            "major": "",
            "university": ""
        }
        
        # Try to find name (usually at the beginning)
        name_patterns = [
            r'^([A-Z][a-z]+ [A-Z][a-z]+)',
            r'Name:?\s*([A-Z][a-z]+ [A-Z][a-z]+)',
            r'^([A-Z][A-Z\s]+[A-Z])',  # All caps name
        ]
        
        for pattern in name_patterns:
            match = re.search(pattern, text, re.MULTILINE)
            if match:
                result['name'] = match.group(1).strip()
                break
        
        # Try to find university
        university_patterns = [
            r'University of ([^,\n]+)',
            r'([^,\n]+ University)',
            r'([^,\n]+ College)',
            r'([^,\n]+ Institute)',
        ]
        
        for pattern in university_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                result['university'] = match.group(1).strip()
                break
        
        # Try to find year/class
        year_patterns = [
            r'Class of (\d{4})',
            r'(Senior|Junior|Sophomore|Freshman)',
            r'(Graduate Student)',
            r'(\d{4} Graduate)',
        ]
        
        for pattern in year_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                result['year'] = match.group(1).strip()
                break
        
        # Try to find major
        major_patterns = [
            r'Major:?\s*([^,\n]+)',
            r'Bachelor of ([^,\n]+)',
            r'B\.?[AS]\.?\s+([^,\n]+)',
            r'studying ([^,\n]+)',
        ]
        
        for pattern in major_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                result['major'] = match.group(1).strip()
                break
        
        # Try to find email
        email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
        if email_match:
            result['email'] = email_match.group().strip()
        
        # Try to find phone
        phone_match = re.search(r'(\+?\d[\d\-\s\(\)]{7,}\d)', text)
        if phone_match:
            result['phone'] = phone_match.group().strip()
        
        # Validate required fields and set defaults
        required_fields = ['name', 'email', 'phone', 'year', 'major', 'university']
        for field in required_fields:
            if field not in result:
                result[field] = ""
            elif not result[field] or result[field] in ['Unknown', 'N/A', 'n/a']:
                result[field] = ""
        
        print(f"Fallback extraction: {result}")
        return result
        
    except Exception as e:
        print(f"Fallback extraction failed: {e}")
        return {
            "name": "",
            "email": "",
            "phone": "",
            "year": "",
            "major": "",
            "university": ""
        }

def generate_similarity_summary(resume_text, contact):
    """Generate similarity between resume and contact with improved error handling"""
    try:
        print(f"Generating similarity for {contact.get('FirstName', 'Unknown')}")
        
        if not resume_text or len(resume_text.strip()) < 10:
            return "Both of you have experience in professional environments."
        
        # Clean and truncate resume text
        clean_resume = resume_text.replace('"', "'").replace('\n', ' ')
        clean_resume = ' '.join(clean_resume.split())[:800]  # Limit to 800 chars
        
        contact_summary = f"""
Name: {contact.get('FirstName', '')} {contact.get('LastName', '')}
Company: {contact.get('Company', '')}
Title: {contact.get('Title', '')}
Education: {contact.get('EducationTop', '')}
Work Summary: {contact.get('WorkSummary', '')}
Volunteer: {contact.get('VolunteerHistory', '')}
"""
        
        prompt = f"""
Compare this resume with the contact's background and identify ONE key similarity in a single sentence.
Focus on: education, work experience, volunteer work, interests, or career path.
Be specific and concise.

Resume (first 800 chars):
{clean_resume}

Contact Background:
{contact_summary}

Generate ONE sentence highlighting the most relevant similarity:
"""
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert at finding meaningful connections between people's backgrounds. Write concise, specific similarities."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=100,
            temperature=0.7
        )
        
        similarity = response.choices[0].message.content.strip()
        # Clean the similarity text
        similarity = similarity.replace('"', "'").strip()
        
        print(f"Generated similarity: {similarity[:50]}...")
        return similarity
        
    except Exception as e:
        print(f"Similarity generation failed: {e}")
        return "Both of you have experience in similar professional environments."

def extract_hometown_from_education(contact):
    """Extract hometown from contact's education history as per your specs"""
    try:
        print(f"Extracting hometown for {contact.get('FirstName', 'Unknown')}")
        
        education = contact.get('EducationTop', '')
        
        # Look for high school location patterns
        location_patterns = [
            r'High School.*?-\s*([^,]+,\s*[A-Z]{2})',
            r'Secondary.*?-\s*([^,]+,\s*[A-Z]{2})',
            r'Prep.*?-\s*([^,]+,\s*[A-Z]{2})'
        ]
        
        for pattern in location_patterns:
            match = re.search(pattern, education)
            if match:
                hometown = match.group(1)
                print(f"Found hometown: {hometown}")
                return hometown
        
        # Fallback to contact's current city
        if contact.get('City') and contact.get('State'):
            hometown = f"{contact['City']}, {contact['State']}"
            print(f"Using current location as hometown: {hometown}")
            return hometown
            
        print("Could not determine hometown")
        return None
        
    except Exception as e:
        print(f"Hometown extraction failed: {e}")
        return None

# ========================================
# GMAIL INTEGRATION
# ========================================

def get_gmail_service():
    """Get Gmail API service"""
    try:
        creds = None
        
        if os.path.exists('token.pickle'):
            with open('token.pickle', 'rb') as token:
                creds = pickle.load(token)
        
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                print("Refreshing Gmail token...")
                creds.refresh(Request())
                with open('token.pickle', 'wb') as token:
                    pickle.dump(creds, token)
            else:
                print("No valid Gmail credentials found")
                return None
        
        service = build('gmail', 'v1', credentials=creds)
        print("Gmail service connected")
        return service
        
    except Exception as e:
        print(f"Gmail service failed: {e}")
        return None

def get_gmail_service_for_user(user_email):
    """Get Gmail API service for a specific user"""
    try:
        # For now, use the existing service - in production you'd want per-user tokens
        print(f"Getting Gmail service for user: {user_email}")
        return get_gmail_service()
        
    except Exception as e:
        print(f"Gmail service failed for {user_email}: {e}")
        return None

def create_gmail_draft_for_user(contact, email_subject, email_body, tier='free', user_email=None):
    """Create Gmail draft in the user's account"""
    try:
        gmail_service = get_gmail_service_for_user(user_email)
        if not gmail_service:
            print(f"Gmail unavailable for {user_email} - creating mock draft")
            return f"mock_{tier}_draft_{contact.get('FirstName', 'unknown').lower()}_user_{user_email}"
        
        print(f"Creating {tier.capitalize()} Gmail draft for {user_email} -> {contact.get('FirstName', 'Unknown')}")
        
        # Get the best available email address
        recipient_email = None
        
        if contact.get('PersonalEmail') and contact['PersonalEmail'] != 'Not available' and '@' in contact['PersonalEmail']:
            recipient_email = contact['PersonalEmail']
        elif contact.get('WorkEmail') and contact['WorkEmail'] != 'Not available' and '@' in contact['WorkEmail']:
            recipient_email = contact['WorkEmail']
        elif contact.get('Email') and '@' in contact['Email'] and not contact['Email'].endswith('@domain.com'):
            recipient_email = contact['Email']
        
        if not recipient_email:
            print(f"No valid email found for {contact.get('FirstName', 'Unknown')} - creating mock draft")
            return f"mock_{tier}_draft_{contact.get('FirstName', 'unknown').lower()}_no_email"
        
        print(f"User {user_email} drafting to: {recipient_email}")
        
        message = MIMEText(email_body)
        message['to'] = recipient_email
        message['subject'] = email_subject
        message['from'] = user_email  # Set the user's email as sender
        
        raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
        
        draft_body = {
            'message': {
                'raw': raw_message
            }
        }
        
        draft_result = gmail_service.users().drafts().create(userId='me', body=draft_body).execute()
        draft_id = draft_result['id']
        
        print(f"Created {tier.capitalize()} Gmail draft {draft_id} in {user_email}'s account")
        
        # Apply appropriate label
        try:
            apply_recruitedge_label_for_user(gmail_service, draft_result['message']['id'], tier, user_email)
        except Exception as label_error:
            print(f"Could not apply {tier} label for {user_email}: {label_error}")
        
        return draft_id
        
    except Exception as e:
        print(f"{tier.capitalize()} Gmail draft creation failed for {user_email}: {e}")
        return f"mock_{tier}_draft_{contact.get('FirstName', 'unknown').lower()}_user_{user_email}"

def apply_recruitedge_label_for_user(gmail_service, message_id, tier, user_email):
    """Apply appropriate RecruitEdge label for specific user"""
    try:
        if tier == 'free':
            label_name = f"RecruitEdge Free - {user_email.split('@')[0]}"
        elif tier == 'pro':
            label_name = f"RecruitEdge Pro - {user_email.split('@')[0]}"
        else:
            label_name = f"RecruitEdge {tier.capitalize()} - {user_email.split('@')[0]}"
        
        labels_result = gmail_service.users().labels().list(userId='me').execute()
        labels = labels_result.get('labels', [])
        
        label_id = None
        for label in labels:
            if label['name'] == label_name:
                label_id = label['id']
                break
        
        if not label_id:
            label_body = {
                'name': label_name,
                'labelListVisibility': 'labelShow',
                'messageListVisibility': 'show'
            }
            label_result = gmail_service.users().labels().create(userId='me', body=label_body).execute()
            label_id = label_result['id']
            print(f"Created '{label_name}' label for {user_email}")
        
        gmail_service.users().messages().modify(
            userId='me',
            id=message_id,
            body={'addLabelIds': [label_id]}
        ).execute()
        
        print(f"Applied {label_name} label for {user_email}")
        
    except Exception as e:
        print(f"Label application failed for {user_email}: {e}")

def create_gmail_draft(contact, email_subject, email_body, tier='free'):
    """Create Gmail draft with appropriate RecruitEdge label"""
    try:
        gmail_service = get_gmail_service()
        if not gmail_service:
            print(f"Gmail unavailable - creating mock draft for {contact.get('FirstName', 'Unknown')}")
            return f"mock_{tier}_draft_{contact.get('FirstName', 'unknown').lower()}"
        
        print(f"Creating {tier.capitalize()} Gmail draft for {contact.get('FirstName', 'Unknown')}")
        
        # Get the best available email address
        recipient_email = None
        
        # Try personal email first (recommended_personal_email)
        if contact.get('PersonalEmail') and contact['PersonalEmail'] != 'Not available' and '@' in contact['PersonalEmail']:
            recipient_email = contact['PersonalEmail']
        # Try work email next
        elif contact.get('WorkEmail') and contact['WorkEmail'] != 'Not available' and '@' in contact['WorkEmail']:
            recipient_email = contact['WorkEmail']
        # Try general email field
        elif contact.get('Email') and '@' in contact['Email'] and not contact['Email'].endswith('@domain.com'):
            recipient_email = contact['Email']
        
        # If no valid email found, create a mock draft
        if not recipient_email:
            print(f"No valid email found for {contact.get('FirstName', 'Unknown')} - creating mock draft")
            return f"mock_{tier}_draft_{contact.get('FirstName', 'unknown').lower()}_no_email"
        
        print(f"Using email: {recipient_email}")
        
        message = MIMEText(email_body)
        message['to'] = recipient_email
        message['subject'] = email_subject
        
        raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
        
        draft_body = {
            'message': {
                'raw': raw_message
            }
        }
        
        draft_result = gmail_service.users().drafts().create(userId='me', body=draft_body).execute()
        draft_id = draft_result['id']
        
        print(f"Created {tier.capitalize()} Gmail draft {draft_id}")
        
        # Apply RecruitEdge label
        try:
            apply_recruitedge_label(gmail_service, draft_result['message']['id'], tier)
        except Exception as label_error:
            print(f"Could not apply {tier} label: {label_error}")
        
        return draft_id
        
    except Exception as e:
        print(f"{tier.capitalize()} Gmail draft creation failed: {e}")
        return f"mock_{tier}_draft_{contact.get('FirstName', 'unknown').lower()}"

def apply_recruitedge_label(gmail_service, message_id, tier):
    """Apply appropriate RecruitEdge label"""
    try:
        # Updated label naming convention for two tiers
        if tier == 'free':
            label_name = "RecruitEdge Free"
        elif tier == 'pro':
            label_name = "RecruitEdge Pro"
        else:
            label_name = f"RecruitEdge {tier.capitalize()}"
        
        labels_result = gmail_service.users().labels().list(userId='me').execute()
        labels = labels_result.get('labels', [])
        
        label_id = None
        for label in labels:
            if label['name'] == label_name:
                label_id = label['id']
                break
        
        if not label_id:
            label_body = {
                'name': label_name,
                'labelListVisibility': 'labelShow',
                'messageListVisibility': 'show'
            }
            label_result = gmail_service.users().labels().create(userId='me', body=label_body).execute()
            label_id = label_result['id']
            print(f"Created '{label_name}' label")
        
        gmail_service.users().messages().modify(
            userId='me',
            id=message_id,
            body={'addLabelIds': [label_id]}
        ).execute()
        
        print(f"Applied {label_name} label")
        
    except Exception as e:
        print(f"Label application failed: {e}")

# ========================================
# TIER ENDPOINT IMPLEMENTATIONS - SIMPLIFIED TO TWO TIERS
# ========================================

def run_free_tier(job_title, company, location, user_email=None, user_name="", user_phone=""):
    """FREE TIER: 8 contacts max with PDL search + email drafting"""
    print(f"Running FREE tier workflow for {user_email}")
    
    try:
        contacts = search_contacts_with_pdl_optimized(job_title, company, location, max_contacts=8)
        
        if not contacts:
            print("No contacts found for Free tier")
            return {'error': 'No contacts found', 'contacts': []}
        
        # Step 2: Generate Free emails for each contact
        successful_drafts = 0
        for contact in contacts:
            email_subject, email_body = generate_email_for_tier(contact, tier='free', user_name=user_name, user_email=user_email, user_phone=user_phone)
            contact['email_subject'] = email_subject
            contact['email_body'] = email_body
            
            # Create Gmail draft
            draft_id = create_gmail_draft_for_user(contact, email_subject, email_body, tier='free', user_email=user_email)
            contact['draft_id'] = draft_id
            if not draft_id.startswith('mock_'):
                successful_drafts += 1
        
        # Filter to Free fields only
        free_contacts = []
        for contact in contacts:
            free_contact = {k: v for k, v in contact.items() if k in TIER_CONFIGS['free']['fields']}
            free_contacts.append(free_contact)
        
        # Generate CSV with user identifier
        csv_file = StringIO()
        fieldnames = TIER_CONFIGS['free']['fields']
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        writer.writeheader()
        for contact in free_contacts:
            writer.writerow(contact)
        
        csv_filename = f"RecruitEdge_Free_{user_email.split('@')[0] if user_email else 'user'}_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        with open(csv_filename, 'w', newline='', encoding='utf-8') as f:
            f.write(csv_file.getvalue())
        
        print(f"Free tier completed for {user_email}: {len(free_contacts)} contacts, {successful_drafts} Gmail drafts")
        return {
            'contacts': free_contacts,
            'csv_file': csv_filename,
            'successful_drafts': successful_drafts,
            'tier': 'free',
            'user_email': user_email
        }
        
    except Exception as e:
        print(f"Free tier failed for {user_email}: {e}")
        return {'error': str(e), 'contacts': []}

def run_pro_tier(job_title, company, location, resume_file, user_email=None, user_name="", user_phone=""):
    """PRO TIER: 56 contacts max with PDL + resume analysis + similarity engine + smart emails"""
    print(f"Running PRO tier workflow for {user_email}")
    
    try:
        # Step 1: Extract and parse resume
        resume_text = extract_text_from_pdf(resume_file)
        if not resume_text:
            return {'error': 'Could not extract text from PDF', 'contacts': []}
        
        resume_info = parse_resume_info(resume_text)
        
        # Step 2: PDL Search for up to 56 contacts (includes all enrichment)
        contacts = search_contacts_with_pdl_optimized(job_title, company, location, max_contacts=56)
        
        if not contacts:
            print("No contacts found for Pro tier")
            return {'error': 'No contacts found', 'contacts': []}
        
        # Step 3: Generate similarities and hometowns for each contact
        for contact in contacts:
            # Generate similarity
            similarity = generate_similarity_summary(resume_text, contact)
            contact['Similarity'] = similarity
            
            # Extract hometown
            hometown = extract_hometown_from_education(contact)
            contact['Hometown'] = hometown or 'Not available'
        
        # Step 4: Generate Pro emails with resume integration
        successful_drafts = 0
        for contact in contacts:
            email_subject, email_body = generate_email_for_tier(
                contact,
                tier='pro',
                resume_info=resume_info,
                similarity=contact['Similarity'],
                hometown=contact['Hometown'],
                user_name=user_name,
                user_email=user_email,
                user_phone=user_phone
            )
            contact['email_subject'] = email_subject
            contact['email_body'] = email_body
            
            # Create Gmail draft
            draft_id = create_gmail_draft_for_user(contact, email_subject, email_body, tier='pro', user_email=user_email)
            contact['draft_id'] = draft_id
            if not draft_id.startswith('mock_'):
                successful_drafts += 1
        
        # Step 5: Filter to Pro fields
        pro_contacts = []
        for contact in contacts:
            pro_contact = {k: v for k, v in contact.items() if k in TIER_CONFIGS['pro']['fields']}
            pro_contacts.append(pro_contact)
        
        # Step 6: Generate CSV
        csv_file = StringIO()
        fieldnames = TIER_CONFIGS['pro']['fields']
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        writer.writeheader()
        for contact in pro_contacts:
            writer.writerow(contact)
        
        csv_filename = f"RecruitEdge_Pro_{user_email.split('@')[0] if user_email else 'user'}_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        with open(csv_filename, 'w', newline='', encoding='utf-8') as f:
            f.write(csv_file.getvalue())
        
        print(f"Pro tier completed for {user_email}: {len(pro_contacts)} contacts, {successful_drafts} Gmail drafts")
        print(f"User: {resume_info.get('name')} - {resume_info.get('year')} {resume_info.get('major')}")
        
        return {
            'contacts': pro_contacts,
            'csv_file': csv_filename,
            'successful_drafts': successful_drafts,
            'resume_info': resume_info,
            'tier': 'pro',
            'user_email': user_email
        }
        
    except Exception as e:
        print(f"Pro tier failed for {user_email}: {e}")
        return {'error': str(e), 'contacts': []}

# ========================================
# ENHANCED TIER FUNCTIONS WITH LOGGING - TWO TIERS ONLY
# ========================================

def run_free_tier_enhanced(job_title, company, location, user_email=None, user_name="", user_phone=""):
    """Enhanced Free tier with validation and logging"""
    print(f"Running FREE tier workflow for {user_email}")
    
    try:
        errors = validate_search_inputs(job_title, company, location)
        if errors:
            return {'error': f"Validation failed: {'; '.join(errors)}", 'contacts': []}
        
        contacts = search_contacts_with_pdl_optimized(job_title, company, location, max_contacts=8)
        
        if not contacts:
            print("No contacts found for Free tier")
            log_api_usage('free', user_email, 0, 0)
            return {'error': 'No contacts found', 'contacts': []}
        
        successful_drafts = 0
        for contact in contacts:
            email_subject, email_body = generate_email_for_tier(contact, tier='free', user_name=user_name, user_email=user_email, user_phone=user_phone)
            contact['email_subject'] = email_subject
            contact['email_body'] = email_body
            
            draft_id = create_gmail_draft_for_user(contact, email_subject, email_body, tier='free', user_email=user_email)
            contact['draft_id'] = draft_id
            if not draft_id.startswith('mock_'):
                successful_drafts += 1
        
        free_contacts = []
        for contact in contacts:
            free_contact = {k: v for k, v in contact.items() if k in TIER_CONFIGS['free']['fields']}
            free_contacts.append(free_contact)
        
        csv_file = StringIO()
        fieldnames = TIER_CONFIGS['free']['fields']
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        writer.writeheader()
        for contact in free_contacts:
            writer.writerow(contact)
        
        csv_content = csv_file.getvalue()
        
        timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
        user_prefix = user_email.split('@')[0] if user_email else 'user'
        csv_filename = f"RecruitEdge_Free_{user_prefix}_{timestamp}.csv"
        
        with open(csv_filename, 'w', newline='', encoding='utf-8') as f:
            f.write(csv_content)
        
        log_api_usage('free', user_email, len(free_contacts), len(free_contacts))
        
        print(f"Free tier completed for {user_email}: {len(free_contacts)} contacts, {successful_drafts} Gmail drafts")
        return {
            'contacts': free_contacts,
            'csv_file': csv_filename,
            'csv_content': csv_content,
            'successful_drafts': successful_drafts,
            'tier': 'free',
            'user_email': user_email,
            'contact_count': len(free_contacts),
            'credits_used': len(free_contacts) * 15,  # 15 credits per email
            'time_saved_minutes': len(free_contacts) * 25  # 25 minutes per email
        }
        
    except Exception as e:
        print(f"Free tier failed for {user_email}: {e}")
        log_api_usage('free', user_email, 0, 0)
        return {'error': str(e), 'contacts': []}

def run_pro_tier_enhanced(job_title, company, location, resume_file, user_email=None, user_name="", user_phone=""):
    """Enhanced Pro tier with validation and logging"""
    print(f"Running PRO tier workflow for {user_email}")
    
    try:
        errors = validate_search_inputs(job_title, company, location)
        if errors:
            return {'error': f"Validation failed: {'; '.join(errors)}", 'contacts': []}
        
        resume_text = extract_text_from_pdf(resume_file)
        if not resume_text:
            log_api_usage('pro', user_email, 0, 0)
            return {'error': 'Could not extract text from PDF', 'contacts': []}
        
        resume_info = parse_resume_info(resume_text)
        
        contacts = search_contacts_with_pdl_optimized(job_title, company, location, max_contacts=56)
        
        if not contacts:
            print("No contacts found for Pro tier")
            log_api_usage('pro', user_email, 0, 0)
            return {'error': 'No contacts found', 'contacts': []}
        
        for contact in contacts:
            similarity = generate_similarity_summary(resume_text, contact)
            contact['Similarity'] = similarity
            
            hometown = extract_hometown_from_education(contact)
            contact['Hometown'] = hometown or 'Not available'
        
        successful_drafts = 0
        for contact in contacts:
            email_subject, email_body = generate_email_for_tier(
                contact,
                tier='pro',
                resume_info=resume_info,
                similarity=contact['Similarity'],
                hometown=contact['Hometown'],
                user_name=user_name,
                user_email=user_email,
                user_phone=user_phone
            )
            contact['email_subject'] = email_subject
            contact['email_body'] = email_body
            
            draft_id = create_gmail_draft_for_user(contact, email_subject, email_body, tier='pro', user_email=user_email)
            contact['draft_id'] = draft_id
            if not draft_id.startswith('mock_'):
                successful_drafts += 1
        
        pro_contacts = []
        for contact in contacts:
            pro_contact = {k: v for k, v in contact.items() if k in TIER_CONFIGS['pro']['fields']}
            pro_contacts.append(pro_contact)
        
        csv_file = StringIO()
        fieldnames = TIER_CONFIGS['pro']['fields']
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        writer.writeheader()
        for contact in pro_contacts:
            writer.writerow(contact)
        
        csv_content = csv_file.getvalue()
        
        timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
        user_prefix = user_email.split('@')[0] if user_email else 'user'
        csv_filename = f"RecruitEdge_Pro_{user_prefix}_{timestamp}.csv"
        
        with open(csv_filename, 'w', newline='', encoding='utf-8') as f:
            f.write(csv_content)
        
        log_api_usage('pro', user_email, len(pro_contacts), len(pro_contacts))
        
        print(f"Pro tier completed for {user_email}: {len(pro_contacts)} contacts, {successful_drafts} Gmail drafts")
        print(f"User: {resume_info.get('name')} - {resume_info.get('year')} {resume_info.get('major')}")
        
        return {
            'contacts': pro_contacts,
            'csv_file': csv_filename,
            'csv_content': csv_content,
            'successful_drafts': successful_drafts,
            'resume_info': resume_info,
            'tier': 'pro',
            'user_email': user_email,
            'contact_count': len(pro_contacts),
            'credits_used': len(pro_contacts) * 15,  # 15 credits per email
            'time_saved_minutes': len(pro_contacts) * 21  # ~21 minutes per email (more efficient at scale)
        }
        
    except Exception as e:
        print(f"Pro tier failed for {user_email}: {e}")
        log_api_usage('pro', user_email, 0, 0)
        return {'error': str(e), 'contacts': []}

# ========================================
# TESTING FUNCTIONS - UPDATED FOR TWO TIERS
# ========================================

def test_pdl_implementation():
    """Test the complete PDL implementation - Two tiers only"""
    print("Testing RecruitEdge PDL Implementation - Free and Pro Tiers")
    
    # Test Free tier
    print("\nTesting Free Tier")
    free_result = run_free_tier_enhanced("Software Engineer", "Google", "San Francisco, CA")
    print(f"Free result: {len(free_result.get('contacts', []))} contacts")
    
    # Test Pro tier would need a resume file, so just print what we'd test
    print("\nTesting Pro Tier")
    print("Pro tier test would require resume file upload")
    
    print("\nTesting complete")

# ========================================
# ADDITIONAL UTILITY FUNCTIONS
# ========================================

def validate_api_keys():
    """Validate that all required API keys are present"""
    missing_keys = []
    
    if not PEOPLE_DATA_LABS_API_KEY or PEOPLE_DATA_LABS_API_KEY == 'your_pdl_api_key':
        missing_keys.append('PEOPLE_DATA_LABS_API_KEY')
    
    if not OPENAI_API_KEY or 'your_openai_api_key' in OPENAI_API_KEY:
        missing_keys.append('OPENAI_API_KEY')

    
    if missing_keys:
        print(f"WARNING: Missing API keys: {', '.join(missing_keys)}")
        return False
    
    print("All API keys validated successfully")
    return True

def log_api_usage(tier, user_email, contacts_found, emails_generated=0):
    """Log API usage for monitoring and billing"""
    timestamp = datetime.datetime.now().isoformat()
    usage_log = {
        'timestamp': timestamp,
        'tier': tier,
        'user_email': user_email,
        'contacts_found': contacts_found,
        'emails_generated': emails_generated
    }
    
    print(f"API Usage: {usage_log}")
    
    try:
        with open('usage_log.json', 'a') as f:
            f.write(json.dumps(usage_log) + '\n')
    except Exception as e:
        print(f"Failed to write usage log: {e}")

def cleanup_old_csv_files():
    """Clean up old CSV files to save disk space"""
    try:
        current_time = datetime.datetime.now()
        
        for filename in os.listdir('.'):
            if filename.startswith('RecruitEdge_') and filename.endswith('.csv'):
                file_time = datetime.datetime.fromtimestamp(os.path.getctime(filename))
                age_hours = (current_time - file_time).total_seconds() / 3600
                
                if age_hours > 24:
                    os.remove(filename)
                    print(f"Cleaned up old CSV file: {filename}")
                    
    except Exception as e:
        print(f"Error cleaning up CSV files: {e}")

# ========================================
# ERROR HANDLING AND RATE LIMITING
# ========================================

def handle_pdl_rate_limit():
    """Handle PDL API rate limiting"""
    print("PDL API rate limit hit - implementing backoff strategy")
    import time
    time.sleep(5)

def validate_search_inputs(job_title, company, location):
    errors = []
    
    if not job_title or len(job_title.strip()) < 2:
        errors.append("Job title must be at least 2 characters")
    
    # Company is optional - only validate if provided
    if company and len(company.strip()) < 2:
        errors.append("Company name must be at least 2 characters")
    
    if not location or len(location.strip()) < 2:
        errors.append("Location must be at least 2 characters")
    
    return errors

# ========================================
# STARTUP VALIDATION
# ========================================

def startup_checks():
    """Run startup validation checks"""
    print("Running startup checks...")
    
    # Initialize database
    try:
        init_db()
        print("SQLite database initialized: OK")
    except Exception as e:
        print(f"SQLite database initialization: FAILED - {e}")
    
    if not validate_api_keys():
        print("WARNING: Some API keys are missing or invalid")
    
    cleanup_old_csv_files()
    
    try:
        test_response = requests.get(
            f"{PDL_BASE_URL}/person/search",
            params={
                'api_key': PEOPLE_DATA_LABS_API_KEY,
                'query': '{"query":{"bool":{"must":[{"exists":{"field":"emails"}}]}},"size":1}'
            },
            timeout=10
        )
        if test_response.status_code in [200, 402]:
            print("PDL API connection: OK")
        else:
            print(f"PDL API connection: ERROR ({test_response.status_code})")
    except Exception as e:
        print(f"PDL API connection: ERROR ({e})")
    
    print("Startup checks completed")

def search_contacts_with_pdl(job_title, company, location, max_contacts=8):
    """Wrapper function - redirect to optimized version for backward compatibility"""
    return search_contacts_with_pdl_optimized(job_title, company, location, max_contacts)

# ========================================
# MAIN API ENDPOINTS - SIMPLIFIED TO TWO TIERS
# ========================================

@app.route('/ping')
def ping():
    return "pong"

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'tiers': ['free', 'pro'],
        'services': {
            'pdl': 'connected',
            'openai': 'connected',
            'gmail': 'connected' if get_gmail_service() else 'unavailable'
        }
    })

@app.route('/api/tier-info')
def get_tier_info():
    """Get information about available tiers"""
    return jsonify({
        'tiers': {
            'free': {
                'name': 'Free',
                'max_contacts': TIER_CONFIGS['free']['max_contacts'],
                'credits': TIER_CONFIGS['free']['credits'],
                'time_saved_minutes': TIER_CONFIGS['free']['time_saved_minutes'],
                'description': TIER_CONFIGS['free']['description'],
                'features': [
                    f"{TIER_CONFIGS['free']['credits']} credits",
                    f"Estimated time saved: {TIER_CONFIGS['free']['time_saved_minutes']} minutes",
                    "Try out platform risk free",
                    "Limited Features"
                ]
            },
            'pro': {
                'name': 'Pro',
                'max_contacts': TIER_CONFIGS['pro']['max_contacts'],
                'credits': TIER_CONFIGS['pro']['credits'],
                'time_saved_minutes': TIER_CONFIGS['pro']['time_saved_minutes'],
                'description': TIER_CONFIGS['pro']['description'],
                'features': [
                    f"{TIER_CONFIGS['pro']['credits']} credits",
                    f"Estimated time saved: {TIER_CONFIGS['pro']['time_saved_minutes']} minutes",
                    "Everything in free plus:",
                    "Directory permanently saves",
                    "Priority Support",
                    "Advanced features"
                ]
            }
        }
    })

@app.route('/api/directory/contacts', methods=['GET'])
def get_directory_contacts():
    user_email = (request.args.get('userEmail') or '').strip()
    return jsonify({'contacts': list_contacts_sqlite(user_email)})

@app.route('/api/directory/contacts', methods=['POST'])
def post_directory_contacts():
    data = request.get_json(silent=True) or {}
    user_email = (data.get('userEmail') or '').strip()
    contacts = data.get('contacts') or []
    if not isinstance(contacts, list):
        return jsonify({'error': 'contacts must be an array'}), 400
    saved = save_contacts_sqlite(user_email, contacts)
    return jsonify({'saved': saved})

@app.route('/api/free-run', methods=['POST'])
def free_run():
    """Free tier endpoint - replaces basic-run"""
    try:
        if request.is_json:
            data = request.json or {}
            job_title = data.get('jobTitle', '').strip() if data.get('jobTitle') else ''
            company = data.get('company', '').strip() if data.get('company') else ''
            location = data.get('location', '').strip() if data.get('location') else ''
            user_email = data.get('userEmail', '').strip() if data.get('userEmail') else None
            user_name = data.get('userName', '').strip() if data.get('userName') else ''
            user_phone = data.get('userPhone', '').strip() if data.get('userPhone') else ''
        else:
            job_title = (request.form.get('jobTitle') or '').strip()
            company = (request.form.get('company') or '').strip()
            location = (request.form.get('location') or '').strip()
            user_email = (request.form.get('userEmail') or '').strip() or None
            user_name = (request.form.get('userName') or '').strip()
            user_phone = (request.form.get('userPhone') or '').strip()
        
        print(f"DEBUG - Free endpoint received:")
        print(f"  job_title: '{job_title}' (len: {len(job_title)})")
        print(f"  company: '{company}' (len: {len(company)})")
        print(f"  location: '{location}' (len: {len(location)})")
        print(f"  user_email: '{user_email}'")
        
        if not job_title or not location:
            missing = []
            if not job_title: missing.append('Job Title')
            if not location: missing.append('Location')
            error_msg = f"Missing required fields: {', '.join(missing)}"
            print(f"ERROR: {error_msg}")
            return jsonify({'error': error_msg}), 400
        
        print(f"Free search for {user_email}: {job_title} at {company} in {location}")
        
        result = run_free_tier_enhanced(job_title, company, location, user_email, user_name=user_name, user_phone=user_phone)
        
        if result.get('error'):
            return jsonify({'error': result['error']}), 500
        
        # CHECK FOR JSON FORMAT REQUEST
        want_json = request.args.get('format') == 'json' or 'application/json' in (request.headers.get('Accept', ''))
        if want_json:
            return jsonify(result)
        
        # Check if we should save to directory
        save_flag = False
        if request.is_json:
            data = request.json or {}
            save_flag = bool(data.get('saveToDirectory'))
        else:
            save_flag = (request.form.get('saveToDirectory') == 'true')

        if save_flag and user_email:
            contacts = result.get('contacts', [])
            if not contacts:
                # Fallback: parse from CSV if result doesn't include contacts
                try:
                    parsed = []
                    with open(result['csv_file'], newline='', encoding='utf-8') as f:
                        reader = csv.DictReader(f)
                        for row in reader:
                            parsed.append({
                                'FirstName': row.get('FirstName') or row.get('First Name',''),
                                'LastName': row.get('LastName') or row.get('Last Name',''),
                                'LinkedIn': row.get('LinkedIn') or row.get('LinkedIn URL',''),
                                'Email': row.get('Email') or row.get('Email Address',''),
                                'Title': row.get('Title') or row.get('Job Title',''),
                                'Company': row.get('Company',''),
                                'City': row.get('City',''),
                                'State': row.get('State',''),
                                'College': row.get('College',''),
                            })
                    contacts = parsed
                except Exception as e:
                    print(f"Warning: failed to parse contacts from CSV for save: {e}")
            try:
                saved = save_contacts_sqlite(user_email, contacts)
                print(f"Saved {saved} contacts to directory for {user_email}")
            except Exception as e:
                print(f"Warning: failed to save directory contacts: {e}")

        return send_file(result['csv_file'], as_attachment=True)
        
    except Exception as e:
        print(f"Free endpoint error: {e}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/api/pro-run', methods=['POST'])
def pro_run():
    """Pro tier endpoint - enhanced with resume processing"""
    try:
        print("=== PRO ENDPOINT DEBUG ===")
        print(f"Content-Type: {request.content_type}")
        print(f"Form data keys: {list(request.form.keys())}")
        print(f"Files: {list(request.files.keys())}")
        
        for key in request.form.keys():
            print(f"Form[{key}] = '{request.form.get(key)}'")
        
        job_title = request.form.get('jobTitle')
        company = request.form.get('company')
        location = request.form.get('location')
        user_email = request.form.get('userEmail')
        user_name = request.form.get('userName')
        user_phone = request.form.get('userPhone')
        
        print(f"Raw form values:")
        print(f"  jobTitle: '{job_title}' (type: {type(job_title)})")
        print(f"  company: '{company}' (type: {type(company)})")
        print(f"  location: '{location}' (type: {type(location)})")
        print(f"  userEmail: '{user_email}' (type: {type(user_email)})")
        
        job_title = (job_title or '').strip()
        company = (company or '').strip()
        location = (location or '').strip()
        user_email = (user_email or '').strip() if user_email else None
        user_name = (user_name or '').strip()
        
        print(f"Cleaned values:")
        print(f"  job_title: '{job_title}' (len: {len(job_title)})")
        print(f"  company: '{company}' (len: {len(company)})")
        print(f"  location: '{location}' (len: {len(location)})")
        print("=== END PRO DEBUG ===")
        
        if not job_title or not location:
            missing = []
            if not job_title: missing.append('Job Title')
            if not location: missing.append('Location')
            error_msg = f"Missing required fields: {', '.join(missing)}"
            print(f"VALIDATION ERROR: {error_msg}")
            return jsonify({'error': error_msg}), 400
        
        if 'resume' not in request.files:
            print("ERROR: No resume file in request")
            return jsonify({'error': 'Resume PDF file is required for Pro tier'}), 400
        
        resume_file = request.files['resume']
        if resume_file.filename == '' or not resume_file.filename.lower().endswith('.pdf'):
            print(f"ERROR: Invalid resume file: {resume_file.filename}")
            return jsonify({'error': 'Valid PDF resume file is required'}), 400
        
        print(f"All validations passed!")
        print(f"Pro search for {user_email}: {job_title} at {company} in {location}")
        
        result = run_pro_tier_enhanced(job_title, company, location, resume_file, user_email, user_name=user_name, user_phone=user_phone)
        
        if result.get('error'):
            return jsonify({'error': result['error']}), 500
        
        # CHECK FOR JSON FORMAT REQUEST
        want_json = request.args.get('format') == 'json' or 'application/json' in (request.headers.get('Accept', ''))
        if want_json:
            return jsonify(result)
            
        # Check if we should save to directory
        save_flag = False
        if request.is_json:
            data = request.json or {}
            save_flag = bool(data.get('saveToDirectory'))
        else:
            save_flag = (request.form.get('saveToDirectory') == 'true')

        if save_flag and user_email:
            contacts = result.get('contacts', [])
            if not contacts:
                # Fallback: parse from CSV if result doesn't include contacts
                try:
                    parsed = []
                    with open(result['csv_file'], newline='', encoding='utf-8') as f:
                        reader = csv.DictReader(f)
                        for row in reader:
                            parsed.append({
                                'FirstName': row.get('FirstName') or row.get('First Name',''),
                                'LastName': row.get('LastName') or row.get('Last Name',''),
                                'LinkedIn': row.get('LinkedIn') or row.get('LinkedIn URL',''),
                                'Email': row.get('Email') or row.get('Email Address',''),
                                'Title': row.get('Title') or row.get('Job Title',''),
                                'Company': row.get('Company',''),
                                'City': row.get('City',''),
                                'State': row.get('State',''),
                                'College': row.get('College',''),
                            })
                    contacts = parsed
                except Exception as e:
                    print(f"Warning: failed to parse contacts from CSV for save: {e}")
            try:
                saved = save_contacts_sqlite(user_email, contacts)
                print(f"Saved {saved} contacts to directory for {user_email}")
            except Exception as e:
                print(f"Warning: failed to save directory contacts: {e}")

        return send_file(result['csv_file'], as_attachment=True)
        
    except Exception as e:
        print(f"Pro endpoint exception: {e}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# Backward compatibility - redirect old endpoints to new ones
@app.route('/api/basic-run', methods=['POST'])
def basic_run_redirect():
    """Redirect basic-run to free-run for backward compatibility"""
    print("Redirecting /api/basic-run to /api/free-run")
    return free_run()

@app.route('/api/advanced-run', methods=['POST'])
def advanced_run_redirect():
    """Redirect advanced-run to free-run (advanced tier removed)"""
    print("Redirecting /api/advanced-run to /api/free-run (advanced tier removed)")
    return free_run()

@app.route('/api/autocomplete/<data_type>', methods=['GET'])
def autocomplete_api(data_type):
    """Enhanced API endpoint for frontend autocomplete with better error handling"""
    try:
        query = request.args.get('query', '').strip()
        
        if not query or len(query) < 2:
            return jsonify({
                'suggestions': [],
                'query': query,
                'data_type': data_type
            })
        
        valid_types = ['job_title', 'company', 'location', 'school', 'skill', 'industry', 'role', 'sub_role']
        if data_type not in valid_types:
            return jsonify({
                'error': f'Invalid data type. Must be one of: {", ".join(valid_types)}',
                'suggestions': []
            }), 400
        
        print(f"Autocomplete request: {data_type} - '{query}'")
        
        suggestions = get_autocomplete_suggestions(query, data_type)
        
        clean_suggestions = []
        for suggestion in suggestions[:10]:
            if isinstance(suggestion, dict) and 'name' in suggestion:
                # Handle PDL's response format: {'name': 'value', 'count': 123}
                clean_suggestions.append(suggestion['name'])
            elif isinstance(suggestion, str) and suggestion.strip():
                clean_suggestions.append(suggestion.strip())
        
        return jsonify({
            'suggestions': clean_suggestions,
            'query': query,
            'data_type': data_type,
            'count': len(clean_suggestions)
        })
        
    except Exception as e:
        print(f"Autocomplete API error for {data_type} - '{query}': {e}")
        traceback.print_exc()
        
        return jsonify({
            'error': 'Failed to fetch suggestions',
            'suggestions': [],
            'query': query,
            'data_type': data_type
        }), 500

@app.route('/api/enrich-job-title', methods=['POST'])
def enrich_job_title_api():
    """API endpoint for job title enrichment"""
    try:
        data = request.json
        job_title = data.get('jobTitle', '').strip()
        
        if not job_title:
            return jsonify({'error': 'Job title is required'}), 400
        
        enrichment = enrich_job_title_with_pdl(job_title)
        
        return jsonify({
            'original': job_title,
            'enrichment': enrichment
        })
        
    except Exception as e:
        print(f"Job title enrichment API error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/parse-resume', methods=['POST'])
def parse_resume():
    """Parse uploaded resume and extract user information"""
    try:
        if 'resume' not in request.files:
            return jsonify({'error': 'No resume file provided'}), 400
        
        file = request.files['resume']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({'error': 'Only PDF files are supported'}), 400
        
        resume_text = extract_text_from_pdf(file)
        if not resume_text:
            return jsonify({'error': 'Could not extract text from PDF'}), 400
        
        parsed_info = parse_resume_info(resume_text)
        
        return jsonify({
            'success': True,
            'data': parsed_info
        })
        
    except Exception as e:
        print(f"Resume parsing error: {e}")
        return jsonify({'error': 'Failed to parse resume'}), 500

@app.route('/api/contacts', methods=['GET'])
def get_contacts():
    """Get all contacts for a user"""
    try:
        user_id = request.args.get('userId')
        if not user_id:
            return jsonify({'error': 'User ID required'}), 400
        
        if not db:
            return jsonify({'error': 'Firebase not initialized'}), 500
        
        contacts_ref = db.collection('users').document(user_id).collection('contacts')
        docs = contacts_ref.order_by('createdAt', direction=firestore.Query.DESCENDING).stream()
        
        items = []
        for doc in docs:
            d = doc.to_dict()
            d['id'] = doc.id
            items.append(d)
        
        return jsonify({'contacts': items})
        
    except Exception as e:
        print(f"Error getting contacts: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/contacts', methods=['POST'])
def create_contact():
    """Create a new contact"""
    try:
        data = request.get_json()
        user_id = data.get('userId')
        
        if not user_id:
            return jsonify({'error': 'User ID required'}), 400
        
        if not db:
            return jsonify({'error': 'Firebase not initialized'}), 500
        
        today = datetime.datetime.now().strftime('%m/%d/%Y')
        contact = {
            'firstName': data.get('firstName', ''),
            'lastName': data.get('lastName', ''),
            'linkedinUrl': data.get('linkedinUrl', ''),
            'email': data.get('email', ''),
            'company': data.get('company', ''),
            'jobTitle': data.get('jobTitle', ''),
            'college': data.get('college', ''),
            'location': data.get('location', ''),
            'firstContactDate': today,
            'status': 'Not Contacted',
            'lastContactDate': today,
            'userId': user_id,
            'createdAt': today,
        }
        
        doc_ref = db.collection('users').document(user_id).collection('contacts').add(contact)
        contact['id'] = doc_ref[1].id
        
        return jsonify({'contact': contact}), 201
        
    except Exception as e:
        print(f"Error creating contact: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/contacts/<contact_id>', methods=['PUT'])
def update_contact(contact_id):
    """Update an existing contact"""
    try:
        data = request.get_json()
        user_id = data.get('userId')
        
        if not user_id:
            return jsonify({'error': 'User ID required'}), 400
        
        if not db:
            return jsonify({'error': 'Firebase not initialized'}), 500
        
        ref = db.collection('users').document(user_id).collection('contacts').document(contact_id)
        doc = ref.get()
        
        if not doc.exists:
            return jsonify({'error': 'Contact not found'}), 404
        
        update = {k: data[k] for k in ['firstName', 'lastName', 'linkedinUrl', 'email', 'company', 'jobTitle', 'college', 'location'] if k in data}
        
        if 'status' in data:
            current = doc.to_dict()
            if current.get('status') != data['status']:
                update['lastContactDate'] = datetime.datetime.now().strftime('%m/%d/%Y')
            update['status'] = data['status']
        
        ref.update(update)
        out = ref.get().to_dict()
        out['id'] = contact_id
        
        return jsonify({'contact': out})
        
    except Exception as e:
        print(f"Error updating contact: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/contacts/<contact_id>', methods=['DELETE'])
def delete_contact(contact_id):
    """Delete a contact"""
    try:
        user_id = request.args.get('userId')
        
        if not user_id:
            return jsonify({'error': 'User ID required'}), 400
        
        if not db:
            return jsonify({'error': 'Firebase not initialized'}), 500
        
        ref = db.collection('users').document(user_id).collection('contacts').document(contact_id)
        
        if not ref.get().exists:
            return jsonify({'error': 'Contact not found'}), 404
        
        ref.delete()
        
        return jsonify({'message': 'Contact deleted successfully'})
        
    except Exception as e:
        print(f"Error deleting contact: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/contacts/bulk', methods=['POST'])
def bulk_create_contacts():
    """Bulk create contacts with deduplication"""
    try:
        data = request.get_json() or {}
        user_id = (data.get('userId') or '').strip()
        raw_contacts = data.get('contacts') or []
        print(f"DEBUG - Raw contacts received: {json.dumps(raw_contacts, indent=2)}")
        if not user_id:
            return jsonify({'error': 'User ID required'}), 400
        
        if not db:
            return jsonify({'error': 'Firebase not initialized'}), 500

        contacts_ref = db.collection('users').document(user_id).collection('contacts')
        created = 0
        skipped = 0
        created_contacts = []
        today = datetime.datetime.now().strftime('%m/%d/%Y')

        for rc in raw_contacts:
            first_name = (rc.get('FirstName') or rc.get('firstName') or '').strip()
            last_name = (rc.get('LastName') or rc.get('lastName') or '').strip()
            email = (rc.get('Email') or rc.get('WorkEmail') or rc.get('PersonalEmail') or rc.get('email') or '').strip()
            linkedin = (rc.get('LinkedIn') or rc.get('linkedinUrl') or '').strip()
            company = (rc.get('Company') or rc.get('company') or '').strip()
            job_title = (rc.get('Title') or rc.get('jobTitle') or '').strip()
            college = (rc.get('College') or rc.get('college') or '').strip()
            city = (rc.get('City') or '').strip()
            state = (rc.get('State') or '').strip()
            location = (rc.get('location') or ', '.join([v for v in [city, state] if v]) or '').strip()

            is_dup = False
            if email:
                dup_q = contacts_ref.where('email', '==', email).limit(1).stream()
                is_dup = any(True for _ in dup_q)
            if not is_dup and linkedin:
                dup_q2 = contacts_ref.where('linkedinUrl', '==', linkedin).limit(1).stream()
                is_dup = any(True for _ in dup_q2)

            if is_dup:
                skipped += 1
                continue

            doc_data = {
                'firstName': first_name,
                'lastName': last_name,
                'linkedinUrl': linkedin,
                'email': email,
                'company': company,
                'jobTitle': job_title,
                'college': college,
                'location': location,
                'firstContactDate': today,
                'status': 'Not Contacted',
                'lastContactDate': today,
                'userId': user_id,
                'createdAt': today,
            }
            doc_ref = contacts_ref.add(doc_data)[1]
            doc_data['id'] = doc_ref.id
            created_contacts.append(doc_data)
            created += 1

        return jsonify({
            'created': created,
            'skipped': skipped,
            'contacts': created_contacts
        }), 201

    except Exception as e:
        print(f"Bulk create error: {e}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/update-tier', methods=['POST'])
def update_user_tier():
    """Update user tier and credits"""
    try:
        data = request.get_json() or {}
        user_email = data.get('userEmail', '').strip()
        tier = data.get('tier', '').strip()
        credits = data.get('credits', 0)
        max_credits = data.get('maxCredits', 0)
        
        if not user_email or not tier:
            return jsonify({'error': 'User email and tier required'}), 400
        
        # Validate tier
        if tier not in ['free', 'pro']:
            return jsonify({'error': 'Invalid tier. Must be "free" or "pro"'}), 400
        
        # Store user tier info
        user_data = {
            'email': user_email,
            'tier': tier,
            'credits': credits,
            'maxCredits': max_credits,
            'updated_at': datetime.datetime.now().isoformat()
        }
        
        print(f"Updated user {user_email} to {tier} tier with {credits} credits")
        
        return jsonify({
            'success': True,
            'user': user_data
        })
        
    except Exception as e:
        print(f"User tier update error: {e}")
        return jsonify({'error': str(e)}), 500

# Frontend routes
@app.route('/')
def serve_frontend():
    """Serve the React frontend homepage"""
    try:
        return send_from_directory('connect-grow-hire/dist', 'index.html')
    except:
        return "RecruitEdge API Server Running - Frontend not found"

@app.route('/<path:path>')
def serve_static_files(path):
    """Serve static frontend files"""
    try:
        return send_from_directory('connect-grow-hire/dist', path)
    except FileNotFoundError:
        return send_from_directory('connect-grow-hire/dist', 'index.html')

# Error handlers
@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({'error': 'Internal server error'}), 500

@app.errorhandler(Exception)
def handle_exception(e):
    """Handle uncaught exceptions"""
    print(f"Uncaught exception: {e}")
    traceback.print_exc()
    return jsonify({'error': 'An unexpected error occurred'}), 500

# ========================================
# MAIN ENTRY POINT
# ========================================

if __name__ == '__main__':
    print("=" * 50)
    print("Initializing RecruitEdge server with TWO TIERS: Free and Pro...")
    print("=" * 50)
    
    startup_checks()
    
    print("\n" + "=" * 50)
    print("Starting RecruitEdge server on port 5001...")
    print("Access the API at: http://localhost:5001")
    print("Health check: http://localhost:5001/health")
    print("Available Tiers:")
    print("- FREE: 8 emails, 120 credits, 200 minutes saved")
    print("- PRO: 56 emails, 840 credits, 1200 minutes saved")
    print("New endpoints:")
    print("- /api/free-run (replaces basic-run)")
    print("- /api/pro-run (enhanced with resume)")
    print("- /api/tier-info (get tier information)")
    print("=" * 50 + "\n")
    
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
