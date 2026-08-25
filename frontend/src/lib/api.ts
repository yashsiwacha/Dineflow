const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export async function apiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  body?: any,
  headers: Record<string, string> = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Attach JWT token if present in LocalStorage
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('dineflow_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const options: RequestInit = {
    method,
    headers: { ...defaultHeaders, ...headers },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Failed to parse JSON error response
    }
    throw new Error(errorMessage);
  }

  if (response.status === 24) { // No Content
    return {} as T;
  }

  return response.json();
}
