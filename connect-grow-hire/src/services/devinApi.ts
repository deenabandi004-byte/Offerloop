const API_BASE_URL = 'http://localhost:5001/api';

export interface DevinSessionResponse {
  session_url: string;
  session_id: string;
  status: string;
  message?: string;
}

export interface DevinOptimizationRequest {
  component_name: string;
  optimization_type: 'performance' | 'accessibility' | 'ux' | 'code_quality';
}

export interface DevinAnalyticsRequest {
  analytics_type: 'dashboard' | 'reports' | 'insights' | 'predictions';
  user_email?: string;
}

export interface DevinWorkflowRequest {
  workflow_type: 'email_optimization' | 'contact_validation' | 'crm_integration' | 'smart_scheduling';
  parameters?: Record<string, any>;
  user_email?: string;
}

export interface DevinCustomRequest {
  integration_type: string;
  description: string;
  user_email?: string;
}

class DevinApiService {
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
      }
    }
    return {
      'Content-Type': 'application/json',
    };
  }

  private async makeRequest<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async optimizeComponent(request: DevinOptimizationRequest): Promise<DevinSessionResponse> {
    return this.makeRequest<DevinSessionResponse>('/devin/optimize-component', request);
  }

  async createAnalytics(request: DevinAnalyticsRequest): Promise<DevinSessionResponse> {
    return this.makeRequest<DevinSessionResponse>('/devin/create-analytics', request);
  }

  async createWorkflow(request: DevinWorkflowRequest): Promise<DevinSessionResponse> {
    return this.makeRequest<DevinSessionResponse>('/devin/create-workflow', request);
  }

  async createCustomIntegration(request: DevinCustomRequest): Promise<DevinSessionResponse> {
    return this.makeRequest<DevinSessionResponse>('/devin/custom-integration', request);
  }

  async getSessionStatus(sessionId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/devin/session/${sessionId}/status`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to get session status: ${response.statusText}`);
    }

    return response.json();
  }

  async listKnowledge(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/devin/knowledge`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to get knowledge: ${response.statusText}`);
    }

    return response.json();
  }
}

export const devinApiService = new DevinApiService();
