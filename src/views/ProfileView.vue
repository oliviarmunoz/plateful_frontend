<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { userTastePreferencesApi, type User, type ApiError } from '@/api'

const router = useRouter()
const loading = ref(false)
const error = ref('')
const user = ref<User | null>(null)
const likedDishes = ref<string[]>([])
const dislikedDishes = ref<string[]>([])

// Get current user from localStorage
const getCurrentUser = () => {
  const userData = localStorage.getItem('user')
  if (userData) {
    return JSON.parse(userData)
  }
  return null
}
const loadUserData = async () => {
  try {
    loading.value = true
    error.value = ''

    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push('/login')
      return
    }
    user.value = currentUser

    // Load user's taste preferences
    const userId = currentUser.id.toString()
    const [likedResponse, dislikedResponse] = await Promise.all([
      userTastePreferencesApi.getLikedDishes(userId),
      userTastePreferencesApi.getDislikedDishes(userId),
    ])

    if (Array.isArray(likedResponse) && likedResponse.length > 0) {
      likedDishes.value = likedResponse.map((item) => item.dishes).filter((dish) => dish)
    } else {
      likedDishes.value = []
    }

    if (Array.isArray(dislikedResponse) && dislikedResponse.length > 0) {
      dislikedDishes.value = dislikedResponse.map((item) => item.dishes).filter((dish) => dish)
    } else {
      dislikedDishes.value = []
    }
  } catch (err: unknown) {
    const apiError = err as ApiError
    error.value = apiError.response?.data?.message || 'Failed to load user data'
  } finally {
    loading.value = false
  }
}

const removeLikedDish = async (dish: string) => {
  try {
    await userTastePreferencesApi.removeLikedDish(user.value!.id.toString(), dish)
    likedDishes.value = likedDishes.value.filter((d) => d !== dish)
  } catch (err: unknown) {
    const apiError = err as ApiError
    error.value = apiError.response?.data?.message || 'Failed to remove liked dish'
  }
}

const removeDislikedDish = async (dish: string) => {
  try {
    await userTastePreferencesApi.removeDislikedDish(user.value!.id.toString(), dish)
    dislikedDishes.value = dislikedDishes.value.filter((d) => d !== dish)
  } catch (err: unknown) {
    const apiError = err as ApiError
    error.value = apiError.response?.data?.message || 'Failed to remove disliked dish'
  }
}

const logout = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user')
  router.push('/')
}

const goHome = () => {
  router.push('/')
}

const totalPreferences = computed(() => likedDishes.value.length + dislikedDishes.value.length)

onMounted(() => {
  loadUserData()
})
</script>

<template>
  <div class="profile-page">
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=BBH+Sans+Bartle&family=Montserrat:wght@800&family=Schibsted+Grotesk:ital,wght@0,400..900;1,400..900&display=swap"
      rel="stylesheet"
    />

    <!-- Header with nav -->
    <header class="header">
      <div class="nav-container">
        <nav class="auth-nav">
          <button @click="goHome" class="nav-link profile-link">
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
              class="home-icon"
            >
              <path d="M4 12L12 4l8 8" />
              <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
            </svg>
            <span>Home</span>
          </button>
          <button @click="logout" class="nav-link logout-link">
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
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16,17 21,12 16,7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>

      <div v-else-if="error" class="error">
        <h3>Error</h3>
        <p>{{ error }}</p>
        <button @click="loadUserData" class="retry-button">Try Again</button>
      </div>

      <!-- Profile content -->
      <div v-else-if="user" class="profile-content">
        <!-- User Info Section -->
        <p>{{ message }}</p>
        <section class="user-info">
          <div class="user-avatar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="7" r="4" />
              <path d="M5.5 21a10 10 0 0 1 13 0" />
            </svg>
          </div>
          <div class="user-details">
            <h1 class="user-name">{{ user.username }}</h1>
            <p class="user-email">{{ user.email }}</p>
            <div class="user-stats">
              <div class="stat">
                <span class="stat-number">{{ likedDishes.length }}</span>
                <span class="stat-label">Liked Dishes</span>
              </div>
              <div class="stat">
                <span class="stat-number">{{ dislikedDishes.length }}</span>
                <span class="stat-label">Disliked Dishes</span>
              </div>
              <div class="stat">
                <span class="stat-number">{{ totalPreferences }}</span>
                <span class="stat-label">Total Ranked Dishes</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Taste Preferences Section -->
        <section class="taste-preferences">
          <div class="preferences-header">
            <h2>Taste Preferences</h2>
            <p>Dishes you've liked and disliked to personalize your recommendations</p>
          </div>

          <div class="preferences-grid">
            <!-- Liked Dishes Box -->
            <div class="preference-box liked-box">
              <div class="box-header">
                <div class="box-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M7 10v12" />
                    <path
                      d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"
                    />
                  </svg>
                </div>
                <h3 class="box-title">Liked Dishes</h3>
                <span class="box-count">{{ likedDishes.length }}</span>
              </div>
              <div v-if="likedDishes.length === 0" class="empty-state">
                <p>No liked dishes yet. Start rating dishes to build your taste profile!</p>
              </div>
              <div v-else class="dish-list">
                <div v-for="dish in likedDishes" :key="dish" class="dish-item">
                  <span class="dish-name">{{ dish }}</span>
                  <button
                    @click="removeLikedDish(dish)"
                    class="remove-button"
                    title="Remove from liked dishes"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Disliked Dishes Box -->
            <div class="preference-box disliked-box">
              <div class="box-header">
                <div class="box-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M17 14V2" />
                    <path
                      d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"
                    />
                  </svg>
                </div>
                <h3 class="box-title">Disliked Dishes</h3>
                <span class="box-count">{{ dislikedDishes.length }}</span>
              </div>
              <div v-if="dislikedDishes.length === 0" class="empty-state">
                <p>No disliked dishes yet. Start rating dishes to build your taste profile!</p>
              </div>
              <div v-else class="dish-list">
                <div v-for="dish in dislikedDishes" :key="dish" class="dish-item">
                  <span class="dish-name">{{ dish }}</span>
                  <button
                    @click="removeDislikedDish(dish)"
                    class="remove-button"
                    title="Remove from disliked dishes"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.profile-page {
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

.auth-nav {
  display: flex;
  gap: 1rem;
  color: #606c38;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 2px solid #606c38;
  color: #606c38;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  background: none;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #606c38;
}

.logout-link {
  border-color: #dc2626;
  color: #dc2626;
}

.logout-link:hover {
  background: #dc2626;
  color: white;
}

.main-content {
  margin: 0 auto;
  padding: 4rem 2rem;
}

.loading {
  text-align: center;
  padding: 4rem 2rem;
  color: #606c38;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #606c38;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error {
  text-align: center;
  padding: 4rem 2rem;
  color: #dc2626;
}

.retry-button {
  background: #606c38;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 1rem;
}

.retry-button:hover {
  background: #99ac5d;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.user-info {
  background: #606c38;
  border-radius: 12px;
  padding: 2rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.user-info:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}

.user-avatar {
  color: white;
  flex-shrink: 0;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.5rem 0;
}

.user-email {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin: 0 0 1.5rem 0;
}

.user-stats {
  display: flex;
  gap: 2rem;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.taste-preferences {
  background: #606c38;
  border-radius: 12px;
  padding: 2rem;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.taste-preferences:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}

.preferences-header {
  text-align: center;
  margin-bottom: 2rem;
}

.preferences-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.5rem 0;
}

.preferences-header p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
}

.preferences-section {
  margin-bottom: 2rem;
}

.preferences-section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.3rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1rem;
}

.icon {
  font-size: 1.2rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border: 2px dashed rgba(255, 255, 255, 0.3);
}

.dish-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.dish-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid;
  transition: all 0.3s ease;
}

.dish-item.liked {
  background: rgba(96, 108, 56, 0.15);
  border-color: #606c38;
  color: #4a5a2a;
  border-width: 3px;
  box-shadow: 0 2px 8px rgba(96, 108, 56, 0.2);
}

.dish-item.disliked {
  background: rgba(255, 255, 255, 0.8);
  border-color: rgba(96, 108, 56, 0.3);
  color: #666;
  border-style: dashed;
  border-width: 2px;
  opacity: 0.7;
}

.dish-name {
  font-weight: 500;
  flex: 1;
}

.remove-button {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background 0.3s ease;
  opacity: 0.7;
}

.remove-button:hover {
  background: rgba(0, 0, 0, 0.1);
  opacity: 1;
}

/* New Box Layout Styles */
.preferences-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.preference-box {
  background: rgba(96, 108, 56, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(96, 108, 56, 0.1);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.preference-box:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(96, 108, 56, 0.15);
}

.box-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(96, 108, 56, 0.1);
}

.box-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(96, 108, 56, 0.1);
  color: white;
}

.box-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: white;
  margin: 0;
  flex: 1;
}

.box-count {
  background: #606c38;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 600;
}
</style>
