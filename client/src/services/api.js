import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ecopulse_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, clear invalid token if not already on login/landing
      if (!window.location.pathname.startsWith('/login') && window.location.pathname !== '/') {
        localStorage.removeItem('ecopulse_token');
        localStorage.removeItem('ecopulse_user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  demoLogin: () => api.post('/auth/demo-login'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Resource Monitoring endpoints
export const resourceService = {
  getLogs: (params) => api.get('/resources', { params }),
  getLogById: (id) => api.get(`/resources/${id}`),
  createLog: (data) => api.post('/resources', data),
  updateLog: (id, data) => api.put(`/resources/${id}`, data),
  deleteLog: (id) => api.delete(`/resources/${id}`),
  getSummary: () => api.get('/resources/summary'),
};

// Goals endpoints
export const goalService = {
  getGoals: () => api.get('/goals'),
  createGoal: (data) => api.post('/goals', data),
  updateGoal: (id, data) => api.put(`/goals/${id}`, data),
  deleteGoal: (id) => api.delete(`/goals/${id}`),
};

// Alerts & Anomaly endpoints
export const alertService = {
  getAlerts: () => api.get('/alerts'),
  markRead: (id) => api.put(`/alerts/${id}/read`),
  resolveAlert: (id) => api.put(`/alerts/${id}/resolve`),
  deleteAlert: (id) => api.delete(`/alerts/${id}`),
  clearAll: () => api.delete('/alerts/clear-all'),
};

// AI Sustainability Advisor endpoints
export const advisorService = {
  getRecommendations: () => api.get('/advisor/recommendations'),
};

// Reports endpoints
export const reportService = {
  getSummary: () => api.get('/reports/summary'),
  downloadCSV: async () => {
    const response = await api.get('/reports/export-csv', { responseType: 'blob' });
    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ecopulse-carbon-report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

// Settings & Emission Factors endpoints
export const settingsService = {
  getFactors: () => api.get('/settings/factors'),
  updateFactors: (factors) => api.put('/settings/factors', { factors }),
  seedDemoData: () => api.post('/seed/demo'),
};

export default api;
