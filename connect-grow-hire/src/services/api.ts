// src/services/api.ts
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  `${window.location.protocol}//${window.location.hostname}:5001/api`;

export interface ContactSearchRequest {
  jobTitle: string;
  company: string;
  location: string;
  uid?: string;
  saveToDirectory?: boolean;
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
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    
    try {
      const { auth } = await import('../lib/firebase');
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
        headers['X-User-Uid'] = auth.currentUser.uid;
        headers['X-User-Email'] = auth.currentUser.email || '';
      }
    } catch (error) {
      console.error('Error getting Firebase auth headers:', error);
      
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          if (userData.accessToken) {
            headers['Authorization'] = `Bearer ${userData.accessToken}`;
          }
        } catch (parseError) {
          console.error('Failed to parse user data:', parseError);
          localStorage.removeItem('user');
        }
      }
    }
    
    return headers;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    console.log(`🌐 Making request to: ${url}`);
    console.log(`📤 Request options:`, options);
    
    // For FormData requests, don't add default headers that might override Content-Type
    let headers = { ...options.headers };
    
    // Only add auth headers automatically for non-FormData requests
    if (!(options.body instanceof FormData)) {
      const authHeaders = await this.getAuthHeaders();
      headers = {
        ...authHeaders,
        ...options.headers,
      };
    }

    console.log(`📋 Final headers:`, headers);

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log(`📥 Response status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`❌ API Error:`, errorData);
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    // For CSV downloads, return blob
    if (response.headers.get('content-type')?.includes('text/csv') || 
        response.headers.get('content-disposition')?.includes('attachment')) {
      console.log(`📄 Returning CSV blob`);
      return response.blob() as unknown as T;
    }

    return response.json();
  }

  /**
   * Free tier: 8 contacts with email drafting, basic fields, CSV download
   * Maps to backend /api/free-run endpoint
   */
  async runFreeSearch(request: ContactSearchRequest): Promise<Blob> {
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
      saveToDirectory: request.saveToDirectory ?? false,
    };

    console.log(`🟡 Free Search Request:`, backendRequest);

    return this.makeRequest<Blob>('/free-run', {
      method: 'POST',
      body: JSON.stringify(backendRequest),
    });
  }

  /**
   * Pro tier: 56 contacts with resume analysis, advanced AI features, similarity matching
   * Maps to backend /api/pro-run endpoint
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
    formData.append('saveToDirectory', String(!!request.saveToDirectory));

    console.log(`🟣 Pro Search Request - FormData contents:`);
    console.log(`  jobTitle: "${request.jobTitle}"`);
    console.log(`  company: "${request.company}"`);
    console.log(`  location: "${request.location}"`);
    console.log(`  resume: ${request.resume.name} (${request.resume.size} bytes)`);
    console.log(`  userEmail: "${userEmail}"`);

    // For FormData, DON'T set Content-Type header - let browser set it automatically
    const headers: Record<string, string> = {};
    
    try {
      const { auth } = await import('../lib/firebase');
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting Firebase auth for FormData:', error);
      
      const user_data = localStorage.getItem('user');
      if (user_data) {
        try {
          const userData = JSON.parse(user_data);
          if (userData.accessToken) {
            headers['Authorization'] = `Bearer ${userData.accessToken}`;
          }
        } catch (parseError) {
          console.error('Failed to parse user data for auth:', parseError);
        }
      }
    }

    console.log(`🔐 Headers being sent:`, headers);

    return this.makeRequest<Blob>('/pro-run', {
      method: 'POST',
      headers,
      body: formData,
    });
  }

  // DEPRECATED: Backward compatibility methods that redirect to new endpoints
  /**
   * @deprecated Use runFreeSearch() instead. Basic tier has been merged into Free tier.
   */
  async runBasicSearch(request: ContactSearchRequest): Promise<Blob> {
    console.warn('⚠️ runBasicSearch is deprecated. Use runFreeSearch() instead.');
    return this.runFreeSearch(request);
  }

  /**
   * @deprecated Advanced tier has been removed. Use runFreeSearch() or runProSearch() instead.
   */
  async runAdvancedSearch(request: ContactSearchRequest): Promise<Blob> {
    console.warn('⚠️ runAdvancedSearch is deprecated. Advanced tier removed. Redirecting to Free tier.');
    return this.runFreeSearch(request);
  }

  /**
   * Get tier information from backend
   */
  async getTierInfo(): Promise<{ 
    tiers: { 
      free: { 
        name: string; 
        max_contacts: number; 
        credits: number; 
        time_saved_minutes: number; 
        description: string;
        features: string[];
      };
      pro: { 
        name: string; 
        max_contacts: number; 
        credits: number; 
        time_saved_minutes: number; 
        description: string;
        features: string[];
      };
    } 
  }> {
    return this.makeRequest('/tier-info');
  }

  /**
   * Health check
   */
  async checkHealth(): Promise<{ status: string; tiers: string[]; services: Record<string, string> }> {
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

  async getDirectoryContacts(): Promise<{contacts: Contact[]}> {
    // Temporary hardcode to test - we know this is the right email from the logs
    const email = 'user@example.com';
    console.log('🔍 Fetching directory contacts for email:', email);
    
    return this.makeRequest(`/directory/contacts?userEmail=${encodeURIComponent(email)}`);
  }

  async saveContactsToDirectory(contacts: Contact[]): Promise<{saved:number}> {
    try {
      const { auth } = await import('../lib/firebase');
      const userEmail = auth.currentUser?.email || 'anonymous';
      return this.makeRequest(`/directory/contacts`, {
        method: 'POST',
        body: JSON.stringify({ userEmail, contacts }),
      });
    } catch (error) {
      console.error('Error getting Firebase user for directory save:', error);
      const user = localStorage.getItem('user');
      const email = user ? JSON.parse(user).email : 'anonymous';
      return this.makeRequest(`/directory/contacts`, {
        method: 'POST',
        body: JSON.stringify({ userEmail: email, contacts }),
      });
    }
  }
}

export const apiService = new ApiService();
