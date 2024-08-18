class ApiService {
  constructor() {
    this.baseUrl = 'http://localhost:3001/api';
    this.tokenKey = 'api_token';
  }

  async getApiVersion() {
    try {
      const response = await fetch(`${this.baseUrl}/version`);
      const data = await response.json();

      if (!data.success) {
        throw new Error('Failed to retrieve API version');
      }

      return data.version;
    } catch (error) {
      console.error('Error fetching API version:', error);
      return null;
    }
  }

  async fetchAccessToken() {
    try {
      const response = await fetch(`${this.baseUrl}/v1/getAccessToken`);
      const data = await response.json();

      if (!data.success) {
        throw new Error('Failed to retrieve access token');
      }

      this.storeToken(data.access_token);
      return data.access_token;
    } catch (error) {
      console.error('Error fetching access token:', error);
      return null;
    }
  }

  storeToken(token) {
    try {
      localStorage.setItem(this.tokenKey, token);
    } catch (error) {
      console.error('Error storing token:', error);
    }
  }

  getToken() {
    try {
      return localStorage.getItem(this.tokenKey);
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  }

  clearToken() {
    try {
      localStorage.removeItem(this.tokenKey);
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  }
}

export const API_BASE_URL = new ApiService().baseUrl;
export default new ApiService();
