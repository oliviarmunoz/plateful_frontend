// Common API types and interfaces

// User related types
export interface User {
  id: number
  username: string
  email: string
  first_name?: string
  last_name?: string
  created_at: string
  updated_at: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
  refresh_token?: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  first_name?: string
  last_name?: string
}

// Recipe related types (assuming this is a food/recipe app based on "plateful")
export interface Recipe {
  id: number
  title: string
  description?: string
  ingredients: string[]
  instructions: string[]
  prep_time?: number
  cook_time?: number
  servings?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  cuisine_type?: string
  dietary_tags?: string[]
  image_url?: string
  created_by: number
  created_at: string
  updated_at: string
}

export interface CreateRecipeRequest {
  title: string
  description?: string
  ingredients: string[]
  instructions: string[]
  prep_time?: number
  cook_time?: number
  servings?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  cuisine_type?: string
  dietary_tags?: string[]
  image_url?: string
}

export interface UpdateRecipeRequest extends Partial<CreateRecipeRequest> {
  id: number
}

// Pagination types
export interface PaginationParams {
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

// Search and filter types
export interface RecipeSearchParams extends PaginationParams {
  query?: string
  cuisine_type?: string
  difficulty?: string
  dietary_tags?: string[]
  prep_time_max?: number
  cook_time_max?: number
}
