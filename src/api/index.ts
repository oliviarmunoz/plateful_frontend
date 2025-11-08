// Main API module - exports all API functions
export { apiClient, API_BASE } from './config'
export type { ApiResponse, ApiError } from './config'

// Export all API functions
export { userTastePreferencesApi } from './userTastePreferences'
export { userAuthenticationApi } from './userAuthentication'
export { restaurantMenuApi } from './restaurantMenu'
export { feedbackApi } from './feedback'
export { sessioningApi } from './sessioning'
// Export User type (if needed in views)
export interface User {
  id: number | string
  username: string
  email?: string
  sessionId?: string
}

// Re-export commonly used types for convenience
export type { AxiosInstance, AxiosRequestConfig } from 'axios'
