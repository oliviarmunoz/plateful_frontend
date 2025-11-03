import axios, { type AxiosInstance } from 'axios'

// API Configuration
// In development, use relative URL to leverage Vite proxy
// In production, this should be set via environment variable
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// Create axios instance with default configuration
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth tokens, etc.
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Debug logging for feedback and user taste preferences endpoints
    if (config.url?.includes('/Feedback/') || config.url?.includes('/UserTastePreferences/')) {
      console.log('API Request:', {
        url: config.url,
        method: config.method,
        data: config.data,
      })
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    // Debug logging for feedback and user taste preferences endpoints
    if (response.config.url?.includes('/Feedback/') || response.config.url?.includes('/UserTastePreferences/')) {
      console.log('API Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data,
      })
    }
    // Check if response contains an error property (even with 200 status)
    if (response.data && typeof response.data === 'object' && 'error' in response.data) {
      const errorMessage = response.data.error || 'An error occurred'
      return Promise.reject({
        response: {
          data: { error: errorMessage, message: errorMessage },
          status: response.status,
        },
        message: errorMessage,
      })
    }
    return response
  },
  (error) => {
    // Debug logging for feedback and user taste preferences endpoint errors
    if (error.config?.url?.includes('/Feedback/') || error.config?.url?.includes('/UserTastePreferences/')) {
      console.log('API Error:', {
        url: error.config.url,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      })
    }
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token')
      // Redirect to login page if needed
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

// Generic API response type
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
}

// Generic API error type
export interface ApiError {
  message: string
  status: number
  details?: any
}
