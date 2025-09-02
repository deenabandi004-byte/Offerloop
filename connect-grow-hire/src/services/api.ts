// src/services/api.ts
const API_BASE_URL = 'https://user:5212b22bd05002159bacc5a8ae60a087@onboarding-tracker-app-tunnel-wieroemk.devinapps.com/api';  // ✅ Fixed: Use correct backend tunnel domain

export interface ContactSearchRequest {
  jobTitle: string;
  company: string;
  location: string;
  uid?: string;
}

export interface ProContactSearchRequest extends ContactSearchRequest {
  resume: File;
}

export interface Contact {
  FirstName: string;
  LastName: string;
  LinkedIn: string;
  Email: string;
  Title: string;
  Company: string;
  City: string;
  State: string;
  College: string;
  Phone?: string;
  PersonalEmail?: string;
  WorkEmail?: string;
  SocialProfiles?: string;
  EducationTop?: string;
  VolunteerHistory?: string;
  WorkSummary?: string;
  Group?: string;
  Hometown?: string;
  Similarity?: string;
}

export interface ApiError {
  error: string;
}

class ApiService {
  private getAuthHeaders(): Record<string, string> {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        return {
          'Authorization': `Bearer ${userData.accessToken}`,
          'Content-Type': 'application/json',
        };
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('user');
      }
    }
    return {
      'Content-Type': 'application/json',
    };
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    console.log(`🌐 Making request to: ${url}`); // ✅ Added: Debug logging
    console.log(`📤 Request options:`, options); // ✅ Added: Debug logging
    
    // For FormData requests, don't add default headers that might override Content-Type
    let headers = { ...options.headers };
    
    // Only add auth headers automatically for non-FormData requests
    if (!(options.body instanceof FormData)) {
      const authHeaders = this.getAuthHeaders();
      headers = {
        ...authHeaders,
        ...options.headers,
      };
    }

    console.log(`📋 Final headers:`, headers); // ✅ Added: Debug logging

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log(`📥 Response status: ${response.status}`); // ✅ Added: Debug logging

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`❌ API Error:`, errorData); // ✅ Added: Debug logging
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    // For CSV downloads, return blob
    if (response.headers.get('content-type')?.includes('text/csv') || 
        response.headers.get('content-disposition')?.includes('attachment')) {
      console.log(`📄 Returning CSV blob`); // ✅ Added: Debug logging
      return response.blob() as unknown as T;
    }

    return response.json();
  }

  /**
   * Basic tier: 6 contacts, basic fields, CSV download
   */
  async runBasicSearch(request: ContactSearchRequest): Promise<Blob> {
    // Get user email from stored user data
    const user = localStorage.getItem('user');
    let userEmail = 'anonymous';
    
    if (user) {
      try {
        userEmail = JSON.parse(user).email;
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }

    const backendRequest = {
      jobTitle: request.jobTitle,
      company: request.company,
      location: request.location,
      userEmail: userEmail,
    };

    console.log(`🔵 Basic Search Request:`, backendRequest); // ✅ Added: Debug logging

    return this.makeRequest<Blob>('/basic-run', {
      method: 'POST',
      body: JSON.stringify(backendRequest),
    });
  }

  /**
   * Advanced tier: 8 contacts, enriched data, Gmail drafts, AI emails
   */
  async runAdvancedSearch(request: ContactSearchRequest): Promise<Blob> {
    const user = localStorage.getItem('user');
    let userEmail = 'anonymous';
    
    if (user) {
      try {
        userEmail = JSON.parse(user).email;
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }

    const backendRequest = {
      jobTitle: request.jobTitle,
      company: request.company,
      location: request.location,
      userEmail: userEmail,
    };

    console.log(`🟡 Advanced Search Request:`, backendRequest); // ✅ Added: Debug logging

    return this.makeRequest<Blob>('/advanced-run', {
      method: 'POST',
      body: JSON.stringify(backendRequest),
    });
  }

  /**
   * Pro tier: 12 contacts, resume analysis, similarity engine, smart emails
   */
  async runProSearch(request: ProContactSearchRequest): Promise<Blob> {
    const user = localStorage.getItem('user');
    let userEmail = 'anonymous';
    
    if (user) {
      try {
        userEmail = JSON.parse(user).email;
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }

    const formData = new FormData();
    formData.append('jobTitle', request.jobTitle);
    formData.append('company', request.company);
    formData.append('location', request.location);
    formData.append('resume', request.resume);
    formData.append('userEmail', userEmail);

    console.log(`🟣 Pro Search Request - FormData contents:`); // ✅ Added: Debug logging
    console.log(`  jobTitle: "${request.jobTitle}"`);
    console.log(`  company: "${request.company}"`);
    console.log(`  location: "${request.location}"`);
    console.log(`  resume: ${request.resume.name} (${request.resume.size} bytes)`);
    console.log(`  userEmail: "${userEmail}"`);

    // For FormData, DON'T set Content-Type header - let browser set it automatically
    const headers: Record<string, string> = {};
    
    // Only add Authorization header if we have it
    const user_data = localStorage.getItem('user');
    if (user_data) {
      try {
        const userData = JSON.parse(user_data);
        if (userData.accessToken) {
          headers['Authorization'] = `Bearer ${userData.accessToken}`;
        }
      } catch (error) {
        console.error('Failed to parse user data for auth:', error);
      }
    }

    console.log(`🔐 Headers being sent:`, headers);

    return this.makeRequest<Blob>('/pro-run', {
      method: 'POST',
      headers,
      body: formData,
    });
  }

  /**
   * Health check
   */
  async checkHealth(): Promise<{ status: string; services: Record<string, string> }> {
    return this.makeRequest('/health');
  }

  /**
   * Test PDL connection
   */
  async testPDL(): Promise<{ success: boolean; message: string }> {
    return this.makeRequest('/test-pdl');
  }

  /**
   * Helper to download CSV blob as file
   */
  downloadCsv(blob: Blob, filename: string = 'contacts.csv') {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Parse resume for onboarding autofill
   */
  async parseResumeForOnboarding(resumeFile: File): Promise<{
    firstName: string;
    lastName: string;
    university: string;
    graduationYear: string;
    fieldOfStudy: string;
    success: boolean;
  }> {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    
    formData.append('auth_user', 'user');
    formData.append('auth_pass', '11392b6455e6b26db98ceb44de16af8b');

    console.log(`📄 Parsing resume for onboarding: ${resumeFile.name} (${resumeFile.size} bytes)`);

    return this.makeRequest('/parse-resume-onboarding', {
      method: 'POST',
      body: formData,
    });
  }
}

export const apiService = new ApiService();
