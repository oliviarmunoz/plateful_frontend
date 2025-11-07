import { apiClient, type ApiResponse } from './config'

// User Taste Preferences API endpoints
export const userTastePreferencesApi = {
  // Add a dish to user's liked list
  async addLikedDish(user: string, dish: string): Promise<ApiResponse<Record<string, never>>> {
    const response = await apiClient.post('/UserTastePreferences/addLikedDish', {
      user,
      dish,
    })
    return response.data
  },

  // Remove a dish from user's liked list
  async removeLikedDish(user: string, dish: string): Promise<ApiResponse<Record<string, never>>> {
    const response = await apiClient.post('/UserTastePreferences/removeLikedDish', {
      user,
      dish,
    })
    return response.data
  },

  // Add a dish to user's disliked list
  async addDislikedDish(user: string, dish: string): Promise<ApiResponse<Record<string, never>>> {
    const response = await apiClient.post('/UserTastePreferences/addDislikedDish', {
      user,
      dish,
    })
    return response.data
  },

  // Remove a dish from user's disliked list
  async removeDislikedDish(
    user: string,
    dish: string,
  ): Promise<ApiResponse<Record<string, never>>> {
    const response = await apiClient.post('/UserTastePreferences/removeDislikedDish', {
      user,
      dish,
    })
    return response.data
  },

  // Get all dishes liked by user
  async getLikedDishes(user: string): Promise<ApiResponse<{ dishes: string[] }[]>> {
    const response = await apiClient.post('/UserTastePreferences/_getLikedDishes', {
      user,
    })
    return response.data
  },

  // Get all dishes disliked by user
  async getDislikedDishes(user: string): Promise<ApiResponse<{ dishes: string[] }[]>> {
    const response = await apiClient.post('/UserTastePreferences/_getDislikedDishes', {
      user,
    })
    return response.data
  },
}
