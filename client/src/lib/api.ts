// Centralized API client for TravelTwin backend
// Falls back gracefully if the backend is unavailable (demo mode)

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

const getToken = (): string | null =>
  localStorage.getItem('traveltwin_token');

async function request<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>)
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({ success: false, message: 'Invalid response from server.' }));

  if (!res.ok) {
    throw new ApiError(data.message || `Request failed (${res.status})`, res.status);
  }

  return data;
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (name: string, email: string, password: string) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),

  login: (email: string, password: string) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  me: () => request('/auth/me'),

  updatePreferences: (data: Record<string, any>) =>
    request('/auth/preferences', { method: 'PUT', body: JSON.stringify(data) })
};

// ── Destinations ──────────────────────────────────────────────────────────────
export const destinationsApi = {
  getAll: (params?: { category?: string; country?: string; search?: string; page?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.category) q.set('category', params.category);
    if (params?.country) q.set('country', params.country);
    if (params?.search) q.set('search', params.search);
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    return request(`/destinations?${q.toString()}`);
  },

  getById: (id: string) => request(`/destinations/${id}`)
};

// ── AI ─────────────────────────────────────────────────────────────────────────
export const aiApi = {
  travelDirector: (data: {
    mood: string;
    travelStyle?: string;
    budgetPreference?: string;
    accessibilityNeeds?: string[];
    preferredEnvironment?: string;
  }) => request('/ai/travel-director', { method: 'POST', body: JSON.stringify(data) }),

  destinationGuide: (destinationName: string, question: string, context?: string) =>
    request('/ai/destination-guide', {
      method: 'POST',
      body: JSON.stringify({ destinationName, question, context })
    }),

  generateItinerary: (destination: string, days?: number) =>
    request('/ai/itinerary', { method: 'POST', body: JSON.stringify({ destination, days }) }),

  simulate: (params: Record<string, any>) =>
    request('/ai/simulate', { method: 'POST', body: JSON.stringify(params) })
};

// ── Journeys ──────────────────────────────────────────────────────────────────
export const journeysApi = {
  getAll: () => request('/journeys'),

  create: (destination: string, mode: 'virtual' | 'simulation') =>
    request('/journeys', { method: 'POST', body: JSON.stringify({ destination, mode }) }),

  update: (id: string, data: { progress?: number; status?: string; activities?: string[] }) =>
    request(`/journeys/${id}`, { method: 'PUT', body: JSON.stringify(data) })
};

// ── Rooms ──────────────────────────────────────────────────────────────────────
export const roomsApi = {
  create: (destination: string, destinationId?: string) =>
    request('/rooms/create', { method: 'POST', body: JSON.stringify({ destination, destinationId }) }),

  getByCode: (code: string) => request(`/rooms/${code}`),

  join: (code: string) => request(`/rooms/${code}/join`, { method: 'POST' }),

  updateStage: (code: string, stage: string) =>
    request(`/rooms/${code}/stage`, { method: 'PUT', body: JSON.stringify({ stage }) })
};

// ── Memories ──────────────────────────────────────────────────────────────────
export const memoriesApi = {
  getAll: () => request('/memories'),

  create: (data: {
    destination: string;
    caption: string;
    image: string;
    date: string;
    tags?: string[];
  }) => request('/memories', { method: 'POST', body: JSON.stringify(data) }),

  delete: (id: string) => request(`/memories/${id}`, { method: 'DELETE' })
};

// ── Users ──────────────────────────────────────────────────────────────────────
export const usersApi = {
  getStats: () => request('/users/stats'),
  addXp: (amount: number) => request('/users/xp', { method: 'PUT', body: JSON.stringify({ amount }) })
};

// ── Health ─────────────────────────────────────────────────────────────────────
export const healthCheck = () =>
  fetch(`${BASE_URL.replace('/api', '')}/api/health`).then(r => r.json()).catch(() => null);

export { ApiError };
