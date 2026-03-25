const isLocalFrontend = window.location.protocol === 'file:'
  || window.location.hostname === 'localhost'
  || window.location.hostname === '127.0.0.1';

const BASE_URL = isLocalFrontend
  ? 'http://localhost:3001/api/v1'
  : `${window.location.origin}/api/v1`;

/**
 * Wrapper fetch với auto-inject Authorization header
 */
const request = async (method, endpoint, body = null) => {
  const token = localStorage.getItem('token');
  const opts  = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(body && { body: JSON.stringify(body) }),
  };
  const res = await fetch(`${BASE_URL}${endpoint}`, opts);
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = data?.message || 'Lỗi server';
    throw Object.assign(new Error(message), { status: res.status, data });
  }

  return data;
};

const api = {
  get:    (url)         => request('GET',    url),
  post:   (url, body)   => request('POST',   url, body),
  put:    (url, body)   => request('PUT',    url, body),
  patch:  (url, body)   => request('PATCH',  url, body),
  delete: (url)         => request('DELETE', url),
};

export default api;
