const API_BASE = '/api';

export const api = {
  async handleRequest(method: string, endpoint: string, data?: any) {
    const token = localStorage.getItem('noor_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (data && method !== 'GET') {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'API Error');
    }

    return result;
  },

  get(e: string) { return this.handleRequest('GET', e); },
  post(e: string, d: any) { return this.handleRequest('POST', e, d); },
  put(e: string, d: any) { return this.handleRequest('PUT', e, d); },
  patch(e: string, d?: any) { return this.handleRequest('PATCH', e, d); },
  delete(e: string) { return this.handleRequest('DELETE', e); },
  async upload(e: string, fd: FormData, method: string = 'POST') {
    const token = localStorage.getItem('noor_token');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers,
      body: fd
    };

    const response = await fetch(`${API_BASE}${e}`, config);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Upload Error');
    }

    return result;
  }
};