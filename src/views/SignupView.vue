<template>
  <div class="signup-page">
    <div class="signup-container">
      <div class="signup-form-wrapper">
        <div class="form-header">
          <h1 class="logo">Plateful</h1>
          <h2>Create Account</h2>
        </div>

        <form @submit.prevent="handleSignup" class="signup-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              class="form-input"
              placeholder="Username"
            />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="form-input"
              placeholder="Email address"
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
              placeholder="Password"
            />
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              class="form-input"
              placeholder="Confirm password"
            />
          </div>
          <button type="submit" :disabled="loading" class="submit-button">
            <span v-if="loading">Creating Account...</span>
            <span v-else>Create Account</span>
          </button>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>
        </form>

        <div class="form-footer">
          <p>
            Already have an account?
            <router-link to="/login" class="link">Sign in here</router-link>
          </p>
        </div>
      </div>
      <div class="signup-image">
        <section class="features">
          <div class="feature-card">
            <h3>Personalized Recommendations</h3>
            <p>
              Get dish suggestions curated just for you based on your taste preferences and dining
              history
            </p>
          </div>
          <div class="feature-card">
            <h3>Smart Learning</h3>
            <p>
              Rate dishes you've tried and watch recommendations get smarter and more accurate over
              time
            </p>
          </div>
          <div class="feature-card">
            <h3>Stress-Free Ordering</h3>
            <p>
              No more anxiety about choosing the wrong dish - every recommendation is tailored to
              your unique tastes
            </p>
          </div>
        </section>
      </div>
      <!-- Features section -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { userAuthenticationApi } from '@/api'

const router = useRouter()
const loading = ref(false)
const error = ref('')
const confirmPassword = ref('')

const form = reactive<{
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
  agreeToTerms: boolean
}>({
  username: '',
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  agreeToTerms: false,
})
const handleSignup = async () => {
  error.value = ''

  if (form.password !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  if (form.password.length < 6) {
    error.value = 'Password must be at least 6 characters long'
    return
  }

  try {
    loading.value = true

    await userAuthenticationApi.register({
      username: form.username,
      password: form.password,
    })

    const authRes = await userAuthenticationApi.authenticate({
      username: form.username,
      password: form.password,
    })

    const userId = authRes.user
    const userSession = { id: userId, username: form.username, email: form.email }
    localStorage.setItem('user', JSON.stringify(userSession))

    router.push('/')
  } catch (err: unknown) {
    const apiErr = err as { response?: { data?: { message?: string } }; message?: string }
    const message =
      apiErr?.response?.data?.message || apiErr?.message || 'Signup failed. Please try again.'
    error.value = message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
html,
body,
#app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

body {
  font-family: 'Montserrat', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-optical-sizing: auto;
  font-weight: 800;
  font-style: normal;
}

.signup-page {
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

.signup-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1000px;
  width: 100%;
  min-height: 700px;
}

.signup-form-wrapper {
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

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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
  margin: 0.5rem 0;
}

.checkbox-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
}

.terms-link {
  color: #606c38;
  text-decoration: none;
}

.terms-link:hover {
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

.signup-image {
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

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
  padding: 0 1rem;
}

/* Feature Card: Flex to align content vertically */
.feature-card {
  background: #606c38;
  border-radius: 12px;
  padding: 2rem;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  text-align: center;
}

/* Header style: Keep consistent sizing and vertical alignment */
.feature-card h3 {
  font-size: 1.75rem;
  margin-bottom: 1rem; /* Spacing between header and paragraph */
  font-weight: 600;
  line-height: 1.3; /* Tight line-height for heading */
  color: white;
}

/* Paragraph text: Vertical alignment and consistent spacing */
.feature-card p {
  font-size: 1.1rem;
  line-height: 1.6;
  font-weight: 400;
  margin-top: 0;
  color: rgba(255, 255, 255, 0.8);
  text-align: center; /* Ensures text is centered inside the card */
  flex: 1; /* Takes up available space, ensuring it's centered vertically */
}
</style>
