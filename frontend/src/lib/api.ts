import { dbLogin, dbRegister, dbGetMe } from './auth-db';

function getApiBaseUrl(): string {
  let url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  if (!url.endsWith('/api/v1')) {
    url = `${url}/api/v1`;
  }
  return url;
}

export const API_BASE_URL = getApiBaseUrl();

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('devpulse_token') : null;
  const orgId = typeof window !== 'undefined' ? localStorage.getItem('devpulse_org_id') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (orgId) {
    headers['X-Organization-Id'] = orgId;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(errorData.detail || `Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    // If backend returned explicit HTTP status error (e.g. 401 "Incorrect email or password"), preserve it
    if (
      error.message &&
      !error.message.includes('Failed to fetch') &&
      !error.message.includes('NetworkError') &&
      !error.message.includes('Load failed')
    ) {
      throw error;
    }

    // Backend server is unreachable (offline / static hosting): Use client database engine for authentication
    if (endpoint === '/auth/login' && options.method === 'POST') {
      const body = JSON.parse((options.body as string) || '{}');
      return dbLogin(body) as unknown as T;
    }
    if (endpoint === '/auth/register' && options.method === 'POST') {
      const body = JSON.parse((options.body as string) || '{}');
      return dbRegister(body) as unknown as T;
    }
    if (endpoint === '/auth/me' && token) {
      return dbGetMe(token) as unknown as T;
    }

    console.warn(`API request to ${endpoint} failed:`, error.message);
    throw error;
  }
}
