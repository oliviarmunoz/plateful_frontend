import { apiClient, type ApiResponse } from './config'

// Restaurant Menu API endpoints
export const restaurantMenuApi = {
  // Add a new menu item
  async addMenuItem(
    restaurant: string,
    name: string,
    description: string,
    price: number,
  ): Promise<ApiResponse<{ menuItem: string } | { error: string }>> {
    const response = await apiClient.post('/RestaurantMenu/addMenuItem', {
      restaurant,
      name,
      description,
      price,
    })
    return response.data
  },

  // Update an existing menu item
  async updateMenuItem(
    menuItem: string,
    newDescription?: string,
    newPrice?: number,
  ): Promise<ApiResponse<{ menuItem: string } | { error: string }>> {
    const response = await apiClient.post('/RestaurantMenu/updateMenuItem', {
      menuItem,
      newDescription,
      newPrice,
    })
    return response.data
  },

  // Remove a menu item
  async removeMenuItem(
    menuItem: string,
  ): Promise<ApiResponse<{ success: boolean } | { error: string }>> {
    const response = await apiClient.post('/RestaurantMenu/removeMenuItem', {
      menuItem,
    })
    return response.data
  },

  // Get all menu items for a restaurant
  async _getMenuItems(
    restaurant: string,
  ): Promise<
    ApiResponse<{ menuItem: string; name: string; description: string; price: number }[]>
  > {
    const response = await apiClient.post('/RestaurantMenu/_getMenuItems', {
      restaurant,
    })
    return response.data
  },

  // Get details for a single menu item
  async _getMenuItemDetails(
    menuItem: string,
  ): Promise<ApiResponse<{ name: string; description: string; price: number }[]>> {
    const response = await apiClient.post('/RestaurantMenu/_getMenuItemDetails', {
      menuItem,
    })
    return response.data
  },

  // Get a dish recommendation for a user at a restaurant
  async _getRecommendation(
    restaurant: string,
    user: string,
  ): Promise<ApiResponse<{ recommendation: string }[] | { error: string }[]>> {
    const response = await apiClient.post('/RestaurantMenu/_getRecommendation', {
      restaurant,
      user,
    })
    return response.data
  },
}
