import { apiClient, type ApiResponse } from './config'

// Feedback API endpoints
export const feedbackApi = {
  // Submit new feedback
  async submitFeedback({
    session,
    item,
    rating,
  }: {
    session: string
    item: string
    rating: number
  }): Promise<ApiResponse<{ feedback: string }>> {
    const response = await apiClient.post('/Feedback/submitFeedback', {
      session,
      item,
      rating,
    })
    return response.data
  },

  // Update existing feedback
  async updateFeedback({
    session,
    item,
    newRating,
  }: {
    session: string
    item: string
    newRating: number
  }): Promise<ApiResponse<{ updatedFeedback: string }>> {
    const response = await apiClient.post('/Feedback/updateFeedback', {
      session,
      item,
      newRating,
    })
    return response.data
  },

  // Delete feedback
  async deleteFeedback({
    session,
    item,
  }: {
    session: string
    item: string
  }): Promise<ApiResponse<{ success: boolean }>> {
    const response = await apiClient.post('/Feedback/deleteFeedback', {
      session,
      item,
    })
    return response.data
  },

  // Get feedback for a given user and item
  async getFeedback({
    author,
    item,
  }: {
    author: string
    item: string
  }): Promise<ApiResponse<{ feedback: string }[]>> {
    const response = await apiClient.post('/Feedback/_getFeedback', {
      author,
      item,
    })
    return response.data
  },

  // Get all feedback for a given user
  async getAllUserRatings({
    author,
  }: {
    author: string
  }): Promise<ApiResponse<{ feedback: string }[]>> {
    const response = await apiClient.post('/Feedback/_getAllUserRatings', { author })
    return response.data
  },
}
