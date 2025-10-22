<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { userAuthenticationApi } from '@/api'

const router = useRouter()
const loading = ref(false)
const error = ref('')

const form = reactive<{ username: string; password: string; rememberMe: boolean }>({
  username: '',
  password: '',
  rememberMe: false,
})

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''

    const authRes = await userAuthenticationApi.authenticate({
      username: form.username,
      password: form.password,
    })

    // Persist minimal session
    const userId = authRes.user
    const userSession = { id: userId, username: form.username }
    localStorage.setItem('user', JSON.stringify(userSession))
    // Redirect to home page
    router.push('/')
  } catch (err: unknown) {
    const apiErr = err as { response?: { data?: { message?: string } }; message?: string }
    const message =
      apiErr?.response?.data?.message || apiErr?.message || 'Login failed. Please try again.'
    error.value = message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-form-wrapper">
        <div class="form-header">
          <h1 class="logo">Plateful</h1>
          <h2>Welcome Back</h2>
          <p>Sign in to your account to continue</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="username">Username or Email</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              class="form-input"
              placeholder="Enter your username or email"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="form-input"
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" :disabled="loading" class="submit-button">
            <span v-if="loading">Signing in...</span>
            <span v-else>Sign In</span>
          </button>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>
        </form>

        <div class="form-footer">
          <p>
            Don't have an account?
            <router-link to="/signup" class="link">Sign up here</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fefae0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: grid;
  width: 50%;
  min-height: 600px;
}

.login-form-wrapper {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  color: #606c38;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.form-header h2 {
  color: #333;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.form-header p {
  color: #666;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #333;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-input {
  padding: 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #606c38;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem 0;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: #666;
}

.forgot-password {
  color: #606c38;
  text-decoration: none;
  font-size: 0.9rem;
}

.forgot-password:hover {
  text-decoration: underline;
}

.submit-button {
  background: #606c38;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-top: 1rem;
}

.submit-button:hover:not(:disabled) {
  background: #99ac5d;
}

.submit-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
  font-size: 0.9rem;
}

.form-footer {
  text-align: center;
  margin-top: 2rem;
  color: #666;
}

.link {
  color: #606c38;
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}

.login-image {
  background: #606c38;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: white;
}

.image-content {
  text-align: center;
}

.image-content h3 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.image-content p {
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.6;
}
</style>
