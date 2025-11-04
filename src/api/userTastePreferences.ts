import { apiClient, type ApiResponse } from './config'

// User Taste Preferences API endpoints
export const userTastePreferencesApi = {
  // Add a dish to user's liked list
  async addLikedDish(user: string, dish: string): Promise<ApiResponse<Record<string, never>>> {
    const request = crypto.randomUUID()
    const response = await apiClient.post('/UserTastePreferences/addLikedDish', {
      path: '/UserTastePreferences/addLikedDish',
      request,
      user,
      dish,
    })
    return response.data
  },

  // Remove a dish from user's liked list
  async removeLikedDish(user: string, dish: string): Promise<ApiResponse<Record<string, never>>> {
    const request = crypto.randomUUID()
    const response = await apiClient.post('/UserTastePreferences/removeLikedDish', {
      path: '/UserTastePreferences/removeLikedDish',
      request,
      user,
      dish,
    })
    return response.data
  },

  // Add a dish to user's disliked list
  async addDislikedDish(user: string, dish: string): Promise<ApiResponse<Record<string, never>>> {
    const request = crypto.randomUUID()
    const response = await apiClient.post('/UserTastePreferences/addDislikedDish', {
      path: '/UserTastePreferences/addDislikedDish',
      request,
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
    const request = crypto.randomUUID()
    const response = await apiClient.post('/UserTastePreferences/removeDislikedDish', {
      path: '/UserTastePreferences/removeDislikedDish',
      request,
      user,
      dish,
    })
    return response.data
  },

  // Get all dishes liked by user
  async getLikedDishes(user: string): Promise<ApiResponse<{ dishes: string[] }[]>> {
    const request = crypto.randomUUID()
    const response = await apiClient.post('/UserTastePreferences/_getLikedDishes', {
      path: '/UserTastePreferences/_getLikedDishes',
      request,
      user,
    })
    return response.data
  },

  // Get all dishes disliked by user
  async getDislikedDishes(user: string): Promise<ApiResponse<{ dishes: string[] }[]>> {
    const request = crypto.randomUUID()
    const response = await apiClient.post('/UserTastePreferences/_getDislikedDishes', {
      path: '/UserTastePreferences/_getDislikedDishes',
      request,
      user,
    })
    return response.data
  },
}
