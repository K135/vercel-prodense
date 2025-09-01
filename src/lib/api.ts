const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()
      
      if (!response.ok) {
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
}