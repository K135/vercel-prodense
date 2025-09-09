const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api`

export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Request: ${options.method || 'GET'} ${url}`)
      if (config.body) {
        console.log('Request body:', config.body)
        console.log('Request body type:', typeof config.body)
      }
      console.log('Request headers:', config.headers)
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()
      
      if (!response.ok) {
        console.error(`API Error: ${options.method || 'GET'} ${url} - ${response.status}`, data)
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }
      
      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  },

  // Auth endpoints
  auth: {
    requestOTP: (data: any) => apiClient.request('/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
    verifyOTP: (data: any) => apiClient.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
    signup: (data: any) => apiClient.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
    logout: (token: string) => apiClient.request('/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }),
    
    getMe: (token: string) => apiClient.request('/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }),
  },

  // User endpoints
  user: {
    getProfile: (token: string) => apiClient.request('/user/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }),
    
    updateProfile: (token: string, data: any) => apiClient.request('/user/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),
    
    getHealthProfile: (token: string) => apiClient.request('/user/health-profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }),
    
    updateHealthProfile: (token: string, data: any) => apiClient.request('/user/health-profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),
    
    addMedicalHistory: (token: string, type: string, details: any) => apiClient.request('/user/medical-history', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ type, details }),
    }),
    
    addDentalHistory: (token: string, type: string, details: any) => apiClient.request('/user/dental-history', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ type, details }),
    }),
    
    removeMedicalHistory: (token: string, type: string, index: number) => apiClient.request(`/user/medical-history/${type}/${index}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }),
    
    getHealthProfileCompleteness: (token: string) => apiClient.request('/user/completeness', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }),
    
    getDocuments: (token: string) => apiClient.request('/user/documents', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }),
    
    uploadDocument: (token: string, formData: FormData) => apiClient.request('/user/documents/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    }),
    
    deleteDocument: (token: string, documentId: string) => apiClient.request(`/user/documents/${documentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }),
  },

  // Booking endpoints
  bookings: {
    getAll: (token: string, params?: { status?: string; page?: number; limit?: number }) => {
      const queryParams = new URLSearchParams()
      if (params?.status) queryParams.append('status', params.status)
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      
      const queryString = queryParams.toString()
      const endpoint = queryString ? `/bookings?${queryString}` : '/bookings'
      
      return apiClient.request(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
    },

    getUpcoming: (token: string, params?: { page?: number; limit?: number }) => {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      
      const queryString = queryParams.toString()
      const endpoint = queryString ? `/bookings/upcoming?${queryString}` : '/bookings/upcoming'
      
      return apiClient.request(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
    },

    getHistory: (token: string, params?: { status?: string; page?: number; limit?: number }) => {
      const queryParams = new URLSearchParams()
      if (params?.status) queryParams.append('status', params.status)
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      
      const queryString = queryParams.toString()
      const endpoint = queryString ? `/bookings/history?${queryString}` : '/bookings/history'
      
      return apiClient.request(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
    },

    getById: (token: string, id: string) => apiClient.request(`/bookings/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }),
  },

  // Loyalty endpoints
  loyalty: {
    getPoints: (token: string) => apiClient.request('/loyalty/points', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }),
  },

  // Notifications endpoints
  notifications: {
    getAll: (token: string, params?: { page?: number; limit?: number; type?: string; status?: string }) => {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.type) queryParams.append('type', params.type)
      if (params?.status) queryParams.append('status', params.status)
      
      const queryString = queryParams.toString()
      const endpoint = queryString ? `/notifications?${queryString}` : '/notifications'
      
      // Enhanced logging for notifications
      console.log('🔍 Notifications API Call:')
      console.log('- Endpoint:', endpoint)
      console.log('- Full URL:', `${API_BASE_URL}${endpoint}`)
      console.log('- Token present:', !!token)
      console.log('- Token preview:', token ? `${token.substring(0, 20)}...` : 'None')
      console.log('- Params:', params)
      
      return apiClient.request(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
    },

    getUnread: (token: string) => apiClient.request('/notifications/unread', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }),

    markAsRead: (token: string, id: string) => apiClient.request(`/notifications/${id}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }),

    markAllAsRead: (token: string) => apiClient.request('/notifications/mark-all-read', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }),

    delete: (token: string, id: string) => apiClient.request(`/notifications/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }),

    updatePreferences: (token: string, preferences: any) => apiClient.request('/notifications/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(preferences),
    }),
  },

  // Itinerary endpoints
  itinerary: {
    getAll: (token: string, params?: { status?: string; page?: number; limit?: number }) => {
      const queryParams = new URLSearchParams()
      if (params?.status) queryParams.append('status', params.status)
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      
      const queryString = queryParams.toString()
      const endpoint = queryString ? `/itinerary?${queryString}` : '/itinerary'
      
      return apiClient.request(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
    },

    getCurrent: (token: string) => apiClient.request('/itinerary/current', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }),

    getUpcoming: (token: string) => apiClient.request('/itinerary/upcoming', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }),

    getById: (token: string, id: string) => apiClient.request(`/itinerary/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }),

    getCalendar: (token: string, params?: { month?: number; year?: number }) => {
      const queryParams = new URLSearchParams()
      if (params?.month) queryParams.append('month', params.month.toString())
      if (params?.year) queryParams.append('year', params.year.toString())
      
      const queryString = queryParams.toString()
      const endpoint = queryString ? `/itinerary/calendar?${queryString}` : '/itinerary/calendar'
      
      return apiClient.request(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
    },

    create: (token: string, data: any) => apiClient.request('/itinerary', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),

    update: (token: string, id: string, data: any) => apiClient.request(`/itinerary/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),

    addTreatment: (token: string, id: string, bookingId: string) => apiClient.request(`/itinerary/${id}/treatments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ bookingId }),
    }),

    addActivity: (token: string, id: string, activity: any) => apiClient.request(`/itinerary/${id}/activities`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(activity),
    }),

    updateBudget: (token: string, id: string, budget: any) => apiClient.request(`/itinerary/${id}/budget`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(budget),
    }),

    share: (token: string, id: string, shareData: { email: string; name: string; permissions?: 'view' | 'edit' }) => apiClient.request(`/itinerary/${id}/share`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(shareData),
    }),

    delete: (token: string, id: string) => apiClient.request(`/itinerary/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }),
  },

  // Billing endpoints
  billing: {
    getAll: (token: string, params?: { status?: string; paymentStatus?: string; page?: number; limit?: number }) => {
      const queryParams = new URLSearchParams()
      if (params?.status) queryParams.append('status', params.status)
      if (params?.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus)
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      
      const queryString = queryParams.toString()
      const endpoint = queryString ? `/billing?${queryString}` : '/billing'
      
      return apiClient.request(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
    },

    getSummary: (token: string) => apiClient.request('/billing/summary', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }),

    getById: (token: string, id: string) => apiClient.request(`/billing/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }),

    getOverdue: (token: string) => apiClient.request('/billing/overdue', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }),

    addPayment: (token: string, id: string, paymentData: { amount: number; method: string; reference?: string }) => apiClient.request(`/billing/${id}/payment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    }),

    updateStatus: (token: string, id: string, status: string) => apiClient.request(`/billing/${id}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }),

    exportCsv: (token: string, params?: { status?: string; paymentStatus?: string; startDate?: string; endDate?: string }) => {
      const queryParams = new URLSearchParams()
      if (params?.status) queryParams.append('status', params.status)
      if (params?.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus)
      if (params?.startDate) queryParams.append('startDate', params.startDate)
      if (params?.endDate) queryParams.append('endDate', params.endDate)
      
      const queryString = queryParams.toString()
      const endpoint = queryString ? `/billing/export/csv?${queryString}` : '/billing/export/csv'
      
      return fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
    },
  },
}