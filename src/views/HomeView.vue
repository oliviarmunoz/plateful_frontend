<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

// Check if user is logged in
const getCurrentUser = () => {
  const userData = localStorage.getItem('user')
  if (userData) {
    return JSON.parse(userData)
  }
  return null
}

// Redirect to login if not logged in
onMounted(() => {
  const user = getCurrentUser()
  if (!user) {
    router.push('/login')
  }
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/restaurant/${encodeURIComponent(searchQuery.value.trim())}`)
  }
}

const goToProfile = () => {
  router.push('/profile')
}
</script>

<template>
  <div class="home-page">
    <header class="header">
      <div class="nav-container">
        <nav class="auth-nav">
          <button @click="goToProfile" class="nav-link profile-link">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="profile-icon"
            >
              <circle cx="12" cy="7" r="4" />
              <path d="M5.5 21a10 10 0 0 1 13 0" />
            </svg>
            <span>Profile</span>
          </button>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <div class="hero-section">
        <h2 class="hero-title">Plateful</h2>
        <p class="hero-subtitle">
          Get personalized dish recommendations that match your taste, so every meal is exciting and
          stress-free!
        </p>

        <div class="search-container">
          <form @submit.prevent="handleSearch" class="search-form">
            <div class="search-input-group">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search for a restaurant name..."
                class="search-input"
              />
              <button type="submit" class="search-button">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fefae0;
}

.header {
  padding: 1rem 0;
  justify-content: flex-end;
}

.nav-container {
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.logo {
  color: white;
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.profile-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 2px solid black;
  color: #606c38;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  background: none;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.profile-link:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #606c38;
}

.profile-icon {
  color: inherit;
}

.auth-nav {
  display: flex;
  gap: 1rem;
  color: #606c38;
}

.profile-icon-text {
  font-size: 1rem;
  font-weight: 800;
  color: #606c38;
}

.nav-link {
  background: none;
  border: 2px solid #606c38;
  color: #606c38;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

.nav-link.signup {
  background: white;
  color: #667eea;
  border-color: white;
}

.nav-link.signup:hover {
  background: rgba(255, 255, 255, 0.9);
}

.main-content {
  margin: 0 auto;
  padding: 0rem 0rem;
}

.hero-section {
  text-align: center;
  margin-bottom: 18rem;
}

.hero-title {
  color: #606c38;
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  color: #606c38;
  font-size: 1.4rem;
  margin-bottom: 3rem;
}

.search-container {
  max-width: 700px;
  margin: 0 auto;
}

.search-form {
  width: 100%;
}

.search-input-group {
  display: flex;
  background: white;
  border-radius: 50px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.search-input {
  flex: 1;
  border: none;
  padding: 1.5rem 2rem;
  font-size: 1.2rem;
  outline: none;
}

.search-input::placeholder {
  color: #606c38;
}

.search-button {
  background: #606c38;
  border: none;
  color: white;
  padding: 1.5rem 2rem;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-button:hover {
  background: #99ac5d;
}
</style>
