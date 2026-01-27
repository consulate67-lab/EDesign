const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isLocal ? 'http://localhost:3002/api' : '/api';

// Demo Mode state
let demoCredits = 5;

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

        try {
            const res = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers
            });

            if (res.status === 401 || res.status === 403) {
                // Potential session expiry
            }

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'API Request Failed');
            }
            return data;
        } catch (err) {
            console.warn('⚠️ API Connection failed. Falling back to Demo Mode.', err);
            // Mock data for Demo Mode
            if (endpoint === '/me') return { full_name: 'Demo Kullanıcı', credits: demoCredits, company_name: 'Demo Ltd.' };
            if (endpoint === '/auth/login') return { token: 'demo-token' };

            if (endpoint.includes('/design/consume-credit')) {
                if (demoCredits > 0) {
                    demoCredits--;
                    return { success: true, credits: demoCredits };
                } else {
                    throw new Error('Yetersiz kredi! Lütfen kredi yükleyin.');
                }
            }

            if (endpoint.includes('/payment/mock')) {
                const amount = (options.body ? JSON.parse(options.body as string).amount : 100) || 100;
                demoCredits += amount;
                return { success: true, credits: demoCredits };
            }

            return { success: true };
        }
    },

    // Admin & Template Logic
    login: (username: string, password: string) => {
        // Super Admin Check
        if (username === 'sarpyilmaz' && password === '07072017') {
            return Promise.resolve({ token: 'admin-token', role: 'admin', full_name: 'Sarp Yılmaz' });
        }
        return api.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    },

    register: (details: { username: string, password: string, full_name: string, company_name: string, phone_number: string }) => api.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(details)
    }),

    getMe: async () => {
        const token = api.getToken();
        if (token === 'admin-token') {
            return { full_name: 'Sarp Yılmaz', role: 'admin', credits: 999999, company_name: 'Super Admin', username: 'sarpyilmaz' };
        }
        return api.request('/me');
    },

    consumeCredit: () => api.request('/design/consume-credit', { method: 'POST' }),

    // Dev/Mock Payment
    addCredits: (amount: number) => api.request('/payment/mock', {
        method: 'POST',
        body: JSON.stringify({ amount })
    }),

    // Admin helper
    makeMeRich: () => api.request('/admin/add-credits', { method: 'POST' }),

    // Template Management (Mock DB)
    saveTemplate: (template: any) => {
        return new Promise((resolve) => {
            const temps = JSON.parse(localStorage.getItem('mock_templates') || '[]');
            const newTemp = {
                ...template,
                id: 'temp_' + Date.now(),
                status: 'pending', // Pending approval
                createdAt: new Date().toISOString()
            };
            temps.push(newTemp);
            localStorage.setItem('mock_templates', JSON.stringify(temps));
            setTimeout(() => resolve({ success: true, id: newTemp.id }), 500);
        });
    },

    getTemplates: (status: 'pending' | 'approved' = 'approved') => {
        return new Promise((resolve) => {
            const temps = JSON.parse(localStorage.getItem('mock_templates') || '[]');
            const filtered = temps.filter((t: any) => t.status === status);
            setTimeout(() => resolve(filtered), 300);
        });
    },

    approveTemplate: (id: string) => {
        return new Promise((resolve) => {
            const temps = JSON.parse(localStorage.getItem('mock_templates') || '[]');
            const updated = temps.map((t: any) => t.id === id ? { ...t, status: 'approved' } : t);
            localStorage.setItem('mock_templates', JSON.stringify(updated));
            resolve({ success: true });
        });
    },

    deleteTemplate: (id: string) => {
        return new Promise((resolve) => {
            const temps = JSON.parse(localStorage.getItem('mock_templates') || '[]');
            const updated = temps.filter((t: any) => t.id !== id);
            localStorage.setItem('mock_templates', JSON.stringify(updated));
            resolve({ success: true });
        });
    }
};
