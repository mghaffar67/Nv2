/**
 * Noor Official V3 - API Client Node
 * Hardened for Vercel Production with absolute endpoint resolution.
 */

const BASE_URL = '/api';

export const api = {
  async handleRequest(method: string, endpoint: string, data?: any) {
    const token = localStorage.getItem('noor_token');
    const headers: Record<string, string> = {
      'Accept': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let body = data;
    if (!(data instanceof FormData) && data) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers,
        body: method !== 'GET' ? body : undefined,
      });

      // Handle non-JSON responses from Serverless errors
      const contentType = response.headers.get("content-type");
      let responseData;
      if (contentType && contentType.indexOf("application/json") !== -1) {
        responseData = await response.json();
      } else {
        responseData = { message: await response.text() };
      }

      if (!response.ok) {
        throw new Error(responseData.message || 'Node Protocol Violation');
      }

      return responseData;
    } catch (err: any) {
      console.error(`[CLOUD FAIL] ${endpoint}:`, err);
      throw err;
    }
  },

  get(e: string) { return this.handleRequest('GET', e); },
  post(e: string, d: any) { return this.handleRequest('POST', e, d); },
  put(e: string, d: any) { return this.handleRequest('PUT', e, d); },
  patch(e: string, d?: any) { return this.handleRequest('PATCH', e, d); },
  delete(e: string) { return this.handleRequest('DELETE', e); },
  upload(e: string, fd: FormData, method: string = 'POST') {
    return this.handleRequest(method, e, fd);
  }
};