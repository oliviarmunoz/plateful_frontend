import { apiClient } from './config'

export interface RegisterPayload {
  username: string
  password: string
}

export interface AuthenticatePayload {
  username: string
  password: string
}

export interface RegisterResponse {
  user: string | number
}

export interface AuthenticateResponse {
  user: string | number
}

export interface GetUsernameResponse {
  username: string
}

export const userAuthenticationApi = {
  async register(payload: RegisterPayload) {
    const res = await apiClient.post<RegisterResponse>('/UserAuthentication/register', payload)
    return res.data
  },

  async authenticate(payload: AuthenticatePayload) {
    const res = await apiClient.post<AuthenticateResponse>(
      '/UserAuthentication/authenticate',
      payload,
    )
    return res.data
  },

  async getUsername(userId: string | number) {
    const res = await apiClient.post<GetUsernameResponse[]>('/UserAuthentication/_getUsername', {
      user: userId,
    })
    return res.data
  },
}
