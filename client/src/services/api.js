import axios from 'axios';

// Create central Axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('edupulse_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format error message consistently
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      'An unexpected network error occurred';
    return Promise.reject(new Error(message));
  }
);

// API Service Methods
export const authService = {
  login: async (credentials) => {
    const res = await API.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData) => {
    const res = await API.post('/auth/register', userData);
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await API.get('/auth/me');
    return res.data;
  }
};

export const courseService = {
  getAll: async (params = {}) => {
    const res = await API.get('/courses', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await API.get(`/courses/${id}`);
    return res.data;
  },
  create: async (courseData) => {
    const res = await API.post('/courses', courseData);
    return res.data;
  },
  update: async (id, courseData) => {
    const res = await API.put(`/courses/${id}`, courseData);
    return res.data;
  },
  delete: async (id) => {
    const res = await API.delete(`/courses/${id}`);
    return res.data;
  }
};

export const enrollmentService = {
  enroll: async (courseId) => {
    const res = await API.post(`/enrollments/${courseId}`);
    return res.data;
  },
  getMyEnrollments: async () => {
    const res = await API.get('/enrollments/my');
    return res.data;
  },
  checkStatus: async (courseId) => {
    const res = await API.get(`/enrollments/check/${courseId}`);
    return res.data;
  },
  updateProgress: async (courseId, lessonId) => {
    const res = await API.put(`/enrollments/${courseId}/progress`, { lessonId });
    return res.data;
  }
};

export const adminService = {
  getStats: async () => {
    const res = await API.get('/admin/stats');
    return res.data;
  },
  getUsers: async () => {
    const res = await API.get('/admin/users');
    return res.data;
  }
};

export default API;
