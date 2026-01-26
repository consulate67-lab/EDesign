const API_URL = 'http://localhost:3002/api';

export const api = {
    getToken: () => localStorage.getItem('token'),
    setToken: (token: string) => localStorage.setItem('token', token),
    logout: () => localStorage.removeItem('token'),

    async request(endpoint: string, options: RequestInit = {}) {
        const token = this.getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers
        };

        const res = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });

        if (res.status === 401 || res.status === 403) {
            // Handle unauthorized (maybe redirect to login)
            // For now just return
        }

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'API Request Failed');
        }
        return data;
    },

    login: (username: string, password: string) => api.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
    }),

    register: (details: { username: string, password: string, full_name: string, company_name: string, phone_number: string }) => api.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(details)
    }),

    getMe: () => api.request('/me'),

    consumeCredit: () => api.request('/design/consume-credit', { method: 'POST' }),

    // Dev/Mock Payment
    addCredits: (amount: number) => api.request('/payment/mock', {
        method: 'POST',
        body: JSON.stringify({ amount })
    }),

    // Admin helper
    makeMeRich: () => api.request('/admin/add-credits', { method: 'POST' })
};
