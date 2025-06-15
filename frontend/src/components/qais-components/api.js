// src/services/api.js - إعداد Axios للتعامل مع Laravel API
import axios from 'axios';

// إعداد الـ base URL للـ API
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// إنشاء instance من axios مع الإعدادات الأساسية
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 ثواني timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// إضافة token للطلبات إذا كان موجود (للمصادقة)
api.interceptors.request.use(
  (config) => {
    // إضافة token إذا موجود - يمكن استخدام auth_token أو token
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// معالجة الأخطاء العامة
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // معالجة أخطاء المصادقة
    if (error.response?.status === 401) {
      // إزالة كل أنواع الـ tokens
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token');
      // إعادة توجيه للـ login (إذا لزم الأمر)
      // window.location.href = '/login';
    }
    
    // معالجة أخطاء الخادم
    if (error.response?.status >= 500) {
      console.error('Server Error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

// دوال API للتذاكر
export const ticketAPI = {
  // جلب جميع التذاكر
  getAllTickets: async () => {
    try {
      const response = await api.get('/tickets');
      return response.data;
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  },

  // إنشاء تذكرة جديدة
  createTicket: async (ticketData) => {
    try {
      const response = await api.post('/tickets', ticketData);
      return response.data;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },

  // جلب تذكرة واحدة
  getTicketById: async (id) => {
    try {
      const response = await api.get(`/tickets/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ticket:', error);
      throw error;
    }
  },

  // تحديث تذكرة
  updateTicket: async (id, ticketData) => {
    try {
      const response = await api.put(`/tickets/${id}`, ticketData);
      return response.data;
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw error;
    }
  },

  // حذف تذكرة
  deleteTicket: async (id) => {
    try {
      const response = await api.delete(`/tickets/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting ticket:', error);
      throw error;
    }
  }
};

// دوال API للأحداث (إذا احتجتها)
export const eventAPI = {
  getAllEvents: async () => {
    try {
      const response = await api.get('/events');
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  createEvent: async (eventData) => {
    try {
      const response = await api.post('/events', eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }
};

// دالة مساعدة لمعالجة أخطاء الـ validation من Laravel
export const handleValidationErrors = (error) => {
  if (error.response?.status === 422) {
    const errors = error.response.data.errors;
    const firstError = Object.values(errors)[0][0];
    return firstError;
  }
  
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  return 'حدث خطأ غير متوقع';
};

// تصدير الـ api client كـ default
export default api;

// تصدير الـ base URL إذا احتجته في مكان آخر
export { API_BASE_URL };