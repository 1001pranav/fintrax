export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

type RequestOptions = RequestInit & { skipJsonParse?: boolean };

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { skipJsonParse, headers, ...rest } = options;
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...rest,
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message = data.message || message;
    } catch {
      // ignore json parse error
    }
    throw new Error(message);
  }

  if (skipJsonParse) {
    // @ts-expect-error – caller expects raw Response
    return res;
  }
  return res.json();
}

// Helper to get auth token from session/cookie
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  // Token might be stored in cookie or localStorage
  return document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || null;
}

// Helper to add auth headers
function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // User authentication
  login: (data: { email: string; password: string }) =>
    request('/user/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data: { username: string; email: string; password: string }) =>
    request('/user/register', { method: 'POST', body: JSON.stringify(data) }),
  generateOtp: (email: string) =>
    request('/user/generate-otp', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (data: { email: string; password: string; otp: string }) =>
    request('/user/forgot-password', { method: 'POST', body: JSON.stringify(data) }),

  // Finance overview
  finance: {
    get: () =>
      request('/finance', { headers: getAuthHeaders() }),
    update: (data: { balance: number; total_debt: number }) =>
      request('/finance', {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: getAuthHeaders()
      }),
  },

  // Transactions
  transactions: {
    getAll: () =>
      request('/transactions', { headers: getAuthHeaders() }),
    get: (id: number) =>
      request(`/transactions/${id}`, { headers: getAuthHeaders() }),
    create: (data: {
      source: string;
      amount: number;
      type: number;
      transaction_type?: number;
      category: string;
      notes_id?: number;
      date?: string;
      status?: number;
    }) =>
      request('/transactions', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: getAuthHeaders()
      }),
    update: (id: number, data: {
      source: string;
      amount: number;
      type: number;
      transaction_type?: number;
      category: string;
      notes_id?: number;
      date?: string;
      status?: number;
    }) =>
      request(`/transactions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: getAuthHeaders()
      }),
    delete: (id: number) =>
      request(`/transactions/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      }),
  },

  // Savings
  savings: {
    getAll: () =>
      request('/savings', { headers: getAuthHeaders() }),
    get: (id: number) =>
      request(`/savings/${id}`, { headers: getAuthHeaders() }),
    create: (data: {
      name: string;
      amount: number;
      rate: number;
      status?: number;
    }) =>
      request('/savings', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: getAuthHeaders()
      }),
    update: (id: number, data: {
      name: string;
      amount: number;
      rate: number;
      status?: number;
    }) =>
      request(`/savings/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: getAuthHeaders()
      }),
    delete: (id: number) =>
      request(`/savings/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      }),
  },

  // Loans
  loans: {
    getAll: () =>
      request('/loans', { headers: getAuthHeaders() }),
    get: (id: number) =>
      request(`/loans/${id}`, { headers: getAuthHeaders() }),
    create: (data: {
      name: string;
      total_amount: number;
      rate: number;
      term: number;
      duration: number;
      premium_amount: number;
      status?: number;
    }) =>
      request('/loans', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: getAuthHeaders()
      }),
    update: (id: number, data: {
      name: string;
      total_amount: number;
      rate: number;
      term: number;
      duration: number;
      premium_amount: number;
      status?: number;
    }) =>
      request(`/loans/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: getAuthHeaders()
      }),
    delete: (id: number) =>
      request(`/loans/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      }),
  },
};
