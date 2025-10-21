// Main API module - exports all API functions
export { apiClient, API_BASE_URL } from './config'
export type { ApiResponse, ApiError } from './config'

// Export all API functions
export { userTastePreferencesApi } from './userTastePreferences'
export { userAuthenticationApi } from './userAuthentication'
export { restaurantMenuApi, type MenuItem } from './restaurantMenu'
export { feedbackApi } from './feedback'

// Export all types
export type {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  Recipe,
  CreateRecipeRequest,
  UpdateRecipeRequest,
  PaginationParams,
  PaginatedResponse,
  RecipeSearchParams,
} from './types'

// Re-export commonly used types for convenience
export type { AxiosInstance, AxiosRequestConfig } from 'axios'
