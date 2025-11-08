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
  request?: string
  user?: string | number
  error?: string
}

export interface AuthenticateResponse {
  request?: string
  user?: string | number
  session?: string | number
  error?: string
}

export interface GetUsernameResponse {
  username: string
}

export const userAuthenticationApi = {
  // Register a new user
  async register(payload: RegisterPayload) {
    const res = await apiClient.post<RegisterResponse>('/UserAuthentication/register', {
      username: payload.username,
      password: payload.password,
    })
    const data = res.data
    // Extract user from response, handling both { user } and { request, user } formats
    if (data.error) {
      throw new Error(data.error)
    }
    if (!data.user) {
      throw new Error('Registration failed: no user returned')
    }
    return { user: data.user }
  },

  // Authenticate a user
  async authenticate(
    payload: AuthenticatePayload,
  ): Promise<{ user: string | number; session: string }> {
    const res = await apiClient.post<AuthenticateResponse>('/UserAuthentication/authenticate', {
      username: payload.username,
      password: payload.password,
    })
    const data = res.data

    if (data.error) {
      throw new Error(data.error)
    }
    if (!data.user) {
      throw new Error('Authentication failed: no user returned')
    }
    if (data.session === undefined || data.session === null) {
      throw new Error('Authentication failed: no session returned')
    }
    return { user: data.user, session: String(data.session) }
  },

  // Get the username of a user
  async getUsername(userId: string | number): Promise<GetUsernameResponse> {
    const res = await apiClient.post<GetUsernameResponse[]>('/UserAuthentication/_getUsername', {
      user: userId,
    })
    const data = res.data
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No username returned')
    }

    const entry = data.find(
      (candidate): candidate is GetUsernameResponse =>
        !!candidate && typeof candidate === 'object' && typeof candidate.username === 'string',
    )

    if (!entry) {
      throw new Error('Username response malformed')
    }

    return { username: entry.username }
  },

  // logout
  async logout(session: string) {
    const res = await apiClient.post('/logout', {
      session,
    })
    return res.data
  },
}
