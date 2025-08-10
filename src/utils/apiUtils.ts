// Utility functions for API requests with authentication

export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  console.log('Getting auth headers, token:', token ? 'Present' : 'Missing');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const API_BASE = 'http://localhost:5000/api';

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const headers = getAuthHeaders();
  
  console.log(`Making API request to: ${url}`);
  console.log('Headers:', headers);
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  
  console.log(`Response status: ${response.status}`);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error (${response.status}):`, errorText);
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};
