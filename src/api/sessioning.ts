import { apiClient } from './config'

export interface CreateSessionPayload {
  user: string | number
}

export interface DeleteSessionPayload {
  session: string | number
}

export interface CreateSessionResponse {
  session: string | number
  error?: string
}

export interface DeleteSessionResponse {
  error?: string
}

export interface GetUserResponse {
  user: string | number
  error?: string
}
export const sessioningApi = {
  // create a new session
  async create(payload: CreateSessionPayload) {
    const res = await apiClient.post<CreateSessionResponse>('/Sessioning/create', {
      user: payload.user,
    })
    return res.data
  },

  // Authenticate a user
  async delete(payload: DeleteSessionPayload) {
    const res = await apiClient.post<DeleteSessionResponse>('/Sessioning/delete', {
      session: payload.session,
    })
    return res.data
  },

  // Get the username of a user
  async getUser(session: string | number) {
    const res = await apiClient.post<GetUserResponse>('/Sessioning/_getUser', {
      session: session,
    })
    return res.data
  },
}
