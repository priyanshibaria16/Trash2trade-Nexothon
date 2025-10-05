/**
 * Make an authenticated API call to the backend
 * @param endpoint API endpoint (e.g., '/api/auth/profile')
 * @param options Fetch options (method, headers, body, etc.)
 * @returns Response data
 */
export const authenticatedFetch = async (endpoint: string, options: RequestInit = {}) => {
  // Get token from localStorage
  const token = localStorage.getItem('trash2trade_token');
  
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };
  
  // Make the API call
  const response = await fetch(`http://localhost:5001${endpoint}`, {
    ...options,
    headers,
  });
  
  // Parse response
  const data = await response.json();
  
  // Handle authentication errors
  if (response.status === 401) {
    // Clear user data and token
    localStorage.removeItem('trash2trade_user');
    localStorage.removeItem('trash2trade_token');
    window.location.href = '/login';
    throw new Error('Authentication required');
  }
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
};

/**
 * Make a GET request to the backend
 * @param endpoint API endpoint
 * @returns Response data
 */
export const apiGet = (endpoint: string) => {
  return authenticatedFetch(endpoint, { method: 'GET' });
};

/**
 * Make a POST request to the backend
 * @param endpoint API endpoint
 * @param data Request body data
 * @returns Response data
 */
export const apiPost = (endpoint: string, data: any) => {
  return authenticatedFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Make a PUT request to the backend
 * @param endpoint API endpoint
 * @param data Request body data
 * @returns Response data
 */
export const apiPut = (endpoint: string, data: any) => {
  return authenticatedFetch(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * Make a DELETE request to the backend
 * @param endpoint API endpoint
 * @returns Response data
 */
export const apiDelete = (endpoint: string) => {
  return authenticatedFetch(endpoint, { method: 'DELETE' });
};