
const BASE_URL = '/api';

export const api = {
  async get(endpoint: string) {
    const token = localStorage.getItem('noor_token');
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      localStorage.clear();
      window.location.href = '#/login';
      throw new Error("Session expired");
    }

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Request failed");
    }
    return result;
  },

  async post(endpoint: string, data: any) {
    const token = localStorage.getItem('noor_token');
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Request failed");
    return result;
  },

  async put(endpoint: string, data: any) {
    const token = localStorage.getItem('noor_token');
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Update failed");
    return result;
  },

  /**
   * Secure Upload Helper
   * Handles FormData for images. Note: Browser sets boundary, so Content-Type is OMITTED.
   */
  async upload(endpoint: string, formData: FormData, method: 'POST' | 'PUT' = 'POST') {
    const token = localStorage.getItem('noor_token');
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`
        // NO Content-Type here!
      },
      body: formData
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Upload failed");
    return result;
  }
};
