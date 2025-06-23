// src/services/ticketService.js
import api from './api';

// دوال API للتذاكر منفصلة عن الإعدادات الأساسية
export const ticketService = {
  // جلب جميع التذاكر
  getAllTickets: async () => {
    try {
      const response = await api.get('/tickets');
      return {
        success: true,
        data: response.data,
        message: 'Tickets fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching tickets:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch tickets'
      };
    }
  },

  // إنشاء تذكرة جديدة
  createTicket: async (ticketData) => {
    try {
      const response = await api.post('/tickets', ticketData);
      return {
        success: true,
        data: response.data,
        message: 'Ticket created successfully'
      };
    } catch (error) {
      console.error('Error creating ticket:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to create ticket',
        errors: error.response?.data?.errors || null
      };
    }
  },

  // جلب تذكرة واحدة بالـ ID
  getTicketById: async (id) => {
    try {
      const response = await api.get(`/tickets/${id}`);
      return {
        success: true,
        data: response.data,
        message: 'Ticket fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching ticket:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch ticket'
      };
    }
  },

  // تحديث تذكرة
  updateTicket: async (id, ticketData) => {
    try {
      const response = await api.put(`/tickets/${id}`, ticketData);
      return {
        success: true,
        data: response.data,
        message: 'Ticket updated successfully'
      };
    } catch (error) {
      console.error('Error updating ticket:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to update ticket',
        errors: error.response?.data?.errors || null
      };
    }
  },

  // حذف تذكرة
  deleteTicket: async (id) => {
    try {
      const response = await api.delete(`/tickets/${id}`);
      return {
        success: true,
        data: response.data,
        message: 'Ticket deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting ticket:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to delete ticket'
      };
    }
  },

  // البحث في التذاكر
  searchTickets: async (searchParams) => {
    try {
      const response = await api.get('/tickets/search', { params: searchParams });
      return {
        success: true,
        data: response.data,
        message: 'Search completed successfully'
      };
    } catch (error) {
      console.error('Error searching tickets:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Search failed'
      };
    }
  }
};

// دوال مساعدة
export const ticketHelpers = {
  // التحقق من صحة بيانات التذكرة
  validateTicketData: (ticketData) => {
    const errors = {};
    
    if (!ticketData.event_name?.trim()) {
      errors.event_name = 'Event name is required';
    }
    
    if (!ticketData.ticket_type?.trim()) {
      errors.ticket_type = 'Ticket type is required';
    }
    
    if (!ticketData.ticket_title?.trim()) {
      errors.ticket_title = 'Ticket title is required';
    }
    
    if (!ticketData.price || parseFloat(ticketData.price) <= 0) {
      errors.price = 'Price must be greater than 0';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // تنسيق بيانات التذكرة للإرسال
  formatTicketData: (formData) => {
    return {
      event_name: formData.eventName?.trim(),
      ticket_type: formData.ticketType?.trim(),
      ticket_title: formData.ticketTitle?.trim(),
      price: parseFloat(formData.price),
      created_at: new Date().toISOString()
    };
  },

  // تنسيق السعر للعرض
  formatPrice: (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  }
};

export default ticketService;