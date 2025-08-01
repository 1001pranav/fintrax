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

export const api = {
  login: (data: { email: string; password: string }) =>
    request('/user/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data: { username: string; email: string; password: string }) =>
    request('/user/register', { method: 'POST', body: JSON.stringify(data) }),
  generateOtp: (email: string) =>
    request('/user/generate-otp', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (data: { email: string; password: string; otp: string }) =>
    request('/user/forgot-password', { method: 'POST', body: JSON.stringify(data) }),
};
