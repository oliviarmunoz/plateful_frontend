import { apiClient, type ApiResponse } from './config'

// Feedback API endpoints
export const feedbackApi = {
  // Submit new feedback
  async submitFeedback({
    author,
    item,
    rating,
  }: {
    author: string
    item: string
    rating: number
  }): Promise<ApiResponse<{ feedback: string }>> {
    const request = crypto.randomUUID()
    const response = await apiClient.post('/Feedback/submitFeedback', {
      path: '/Feedback/submitFeedback',
      request,
      author,
      item,
      rating,
    })
    return response.data
  },

  // Update existing feedback
  async updateFeedback({
    author,
    item,
    newRating,
  }: {
    author: string
    item: string
    newRating: number
  }): Promise<ApiResponse<{ updatedFeedback: string }>> {
    const request = crypto.randomUUID()
    const response = await apiClient.post('/Feedback/updateFeedback', {
      path: '/Feedback/updateFeedback',
      request,
      author,
      item,
      newRating,
    })
    return response.data
  },

  // Delete feedback
  async deleteFeedback({
    author,
    item,
  }: {
    author: string
    item: string
  }): Promise<ApiResponse<{ success: boolean }>> {
    const request = crypto.randomUUID()
    const response = await apiClient.post('/Feedback/deleteFeedback', {
      path: '/Feedback/deleteFeedback',
      request,
      author,
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
    const request = crypto.randomUUID()
    const response = await apiClient.post('/Feedback/_getFeedback', {
      path: '/Feedback/_getFeedback',
      request,
      author,
      item,
    })
    return response.data
  },
}
