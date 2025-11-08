import { apiClient, type ApiResponse } from './config'

// User Taste Preferences API endpoints
export const userTastePreferencesApi = {
  // Add a dish to user's liked list
  async addLikedDish({
    session,
    dish,
  }: {
    session: string
    dish: string
  }): Promise<ApiResponse<Record<string, never>>> {
    const response = await apiClient.post('/UserTastePreferences/addLikedDish', { session, dish })
    return response.data
  },

  // Remove a dish from user's liked list
  async removeLikedDish({
    session,
    dish,
  }: {
    session: string
    dish: string
  }): Promise<ApiResponse<Record<string, never>>> {
    const response = await apiClient.post('/UserTastePreferences/removeLikedDish', {
      session,
      dish,
    })
    return response.data
  },

  // Add a dish to user's disliked list
  async addDislikedDish({
    session,
    dish,
  }: {
    session: string
    dish: string
  }): Promise<ApiResponse<Record<string, never>>> {
    const response = await apiClient.post('/UserTastePreferences/addDislikedDish', {
      session,
      dish,
    })
    return response.data
  },

  // Remove a dish from user's disliked list
  async removeDislikedDish({
    session,
    dish,
  }: {
    session: string
    dish: string
  }): Promise<ApiResponse<Record<string, never>>> {
    const response = await apiClient.post('/UserTastePreferences/removeDislikedDish', {
      session,
      dish,
    })
    return response.data
  },

  // Get all dishes liked by user
  async getLikedDishes({ user }: { user: string }): Promise<ApiResponse<{ dishes: string[] }[]>> {
    const response = await apiClient.post('/UserTastePreferences/_getLikedDishes', { user })
    return response.data
  },

  // Get all dishes disliked by user
  async getDislikedDishes({
    user,
  }: {
    user: string
  }): Promise<ApiResponse<{ dishes: string[] }[]>> {
    const response = await apiClient.post('/UserTastePreferences/_getDislikedDishes', { user })
    return response.data
  },
}
