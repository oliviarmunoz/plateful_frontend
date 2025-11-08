<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  restaurantMenuApi,
  feedbackApi,
  userTastePreferencesApi,
  sessioningApi,
  userAuthenticationApi,
  type User,
} from '@/api'

const route = useRoute()
const router = useRouter()
const restaurantName = decodeURIComponent(route.params.name as string)

const menuItems = ref<{ menuItem: string; name: string; description: string; price: number }[]>([])
const recommendation = ref('')
const loading = ref(true)
const error = ref('')
const feedbackMessage = ref('')
const submittingFeedback = ref(false)
const getCurrentUser = async (): Promise<User | null> => {
  const authToken = localStorage.getItem('auth_token')
  if (!authToken) {
    return null
  }

  try {
    const sessionResponse = await sessioningApi.getUser(authToken)
    if (sessionResponse?.error) {
      throw new Error(sessionResponse.error)
    }

    const sessionUser = sessionResponse?.user
    if (!sessionUser) {
      throw new Error('No user returned for this session')
    }

    const { username } = await userAuthenticationApi.getUsername(sessionUser)

    return {
      id: sessionUser,
      username,
    }
  } catch (err) {
    console.error('Failed to resolve current user:', err)
    return null
  }
}

onMounted(async () => {
  try {
    loading.value = true
    error.value = ''

    const currentUser = await getCurrentUser()
    if (!currentUser) {
      router.push('/login')
      return
    }

    // Fetch menu items
    const menuResponse = await restaurantMenuApi._getMenuItems(restaurantName)
    if (Array.isArray(menuResponse) && menuResponse.length > 0 && 'error' in menuResponse[0]) {
      error.value = menuResponse[0].error
    } else if (Array.isArray(menuResponse) && menuResponse.length === 0) {
      // restaurant not found
      error.value = 'RESTAURANT_NOT_FOUND'
    } else if (Array.isArray(menuResponse)) {
      menuItems.value = menuResponse as {
        menuItem: string
        name: string
        description: string
        price: number
      }[]
    }

    // Fetch recommendation
    try {
      const recommendationResponse = await restaurantMenuApi._getRecommendation(
        restaurantName,
        currentUser.id,
      )
      if (recommendationResponse?.error) {
        error.value = recommendationResponse.error
      } else if (recommendationResponse?.recommendation) {
        recommendation.value = recommendationResponse.recommendation
      }
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { error?: string; message?: string } } }
      error.value =
        apiErr?.response?.data?.error ||
        apiErr?.response?.data?.message ||
        'Failed to load recommendation.'
    }
  } catch (err: unknown) {
    const apiErr = err as { response?: { data?: { error?: string; message?: string } } }
    error.value =
      apiErr?.response?.data?.error ||
      apiErr?.response?.data?.message ||
      'Failed to load restaurant data.'
  } finally {
    loading.value = false
  }
})

const goToProfile = () => {
  router.push('/profile')
}

const goHome = () => {
  router.push('/')
}

const submitStarRating = async (dishName: string, rating: number, menuItemId?: string) => {
  try {
    submittingFeedback.value = true
    feedbackMessage.value = ''

    const authToken = localStorage.getItem('auth_token')
    if (!authToken) {
      router.push('/login')
      return
    }
    const itemId = menuItemId || dishName // Use menuItem ID if available, fallback to name

    // Submit feedback or update existing feedback
    await feedbackApi.submitFeedback({
      session: authToken,
      item: itemId,
      rating: rating,
    })

    feedbackMessage.value = `✓ Rated "${dishName}" ${rating} star${rating !== 1 ? 's' : ''}!`

    setTimeout(() => {
      feedbackMessage.value = ''
    }, 3000)
  } catch (err: unknown) {
    const apiErr = err as { response?: { data?: { error?: string } } }
    feedbackMessage.value = `Error: ${apiErr?.response?.data?.error || 'Failed to submit rating'}`
  } finally {
    submittingFeedback.value = false
  }
}

const addToLiked = async (dishName: string) => {
  const authToken = localStorage.getItem('auth_token')
  if (!authToken) {
    router.push('/login')
    return
  }
  try {
    submittingFeedback.value = true
    feedbackMessage.value = ''

    const dishId = await restaurantMenuApi._getMenuItemByName(dishName)
    await userTastePreferencesApi.addLikedDish({session: authToken, dish: dishId.menuItem})

    feedbackMessage.value = `✓ Added "${dishName}" to your liked dishes!`

    setTimeout(() => {
      feedbackMessage.value = ''
    }, 3000)
  } catch (err: unknown) {
    const apiErr = err as { response?: { data?: { error?: string } } }
    feedbackMessage.value = `Error: ${apiErr?.response?.data?.error || 'Failed to add to liked'}`
  } finally {
    submittingFeedback.value = false
  }
}

const addToDisliked = async (dishName: string, menuItemId?: string) => {
  const authToken = localStorage.getItem('auth_token')
  if (!authToken) {
    router.push('/login')
    return
  }
  try {
    submittingFeedback.value = true
    feedbackMessage.value = ''

    const dishId = menuItemId || dishName // Use menuItem ID if available, fallback to name
    await userTastePreferencesApi.addDislikedDish({session: authToken, dish: dishId})

    feedbackMessage.value = `✓ Added "${dishName}" to your disliked dishes!`

    setTimeout(() => {
      feedbackMessage.value = ''
    }, 3000)
  } catch (err: unknown) {
    const apiErr = err as { response?: { data?: { error?: string } } }
    feedbackMessage.value = `Error: ${apiErr?.response?.data?.error || 'Failed to add to disliked'}`
  } finally {
    submittingFeedback.value = false
  }
}
</script>

<template>
  <div class="restaurant-page">
    <header class="header">
      <div class="nav-container">
        <nav class="auth-nav">
          <button @click="goHome" class="nav-link">Home</button>
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
      <section v-if="loading" class="loading">Loading menu...</section>

      <section v-else-if="error === 'RESTAURANT_NOT_FOUND'" class="error-not-found">
        <div class="error-content">
          <div class="error-emoji">😢</div>
          <h2 class="error-title">Restaurant Not Found</h2>
          <p class="error-message">
            We couldn't find restaurant "<strong>{{ restaurantName }}</strong
            >".
          </p>
          <p class="error-suggestion">Maybe try searching for a different restaurant?</p>
          <button @click="goHome" class="error-button">← Back to Search</button>
        </div>
      </section>

      <section v-else-if="error" class="error">
        <div class="error-content">
          <div class="error-emoji">⚠️</div>
          <h2 class="error-title">Something went wrong</h2>
          <p class="error-message">{{ error }}</p>
          <button @click="goHome" class="error-button">← Back to Search</button>
        </div>
      </section>

      <template v-else>
        <div class="hero-section">
          <h2 class="hero-title">{{ restaurantName }}</h2>

          <section class="recommendation-card" v-if="recommendation">
            <h3>Your Dish Recommendation 🍽️</h3>
            <p class="recommendation-text">{{ recommendation }}</p>

            <!-- Star Rating -->
            <div class="feedback-section">
              <p class="feedback-prompt">Rate this dish:</p>
              <div class="star-rating">
                <button
                  v-for="star in 6"
                  :key="star - 1"
                  @click="submitStarRating(recommendation, star - 1)"
                  :disabled="submittingFeedback"
                  class="star-btn"
                  :title="`${star - 1} star${star - 1 !== 1 ? 's' : ''}`"
                >
                  ⭐ {{ star - 1 }}
                </button>
              </div>

              <!-- Like/Dislike Preference Buttons -->
              <p class="preference-prompt">Add to preferences:</p>
              <div class="preference-buttons">
                <button
                  @click="addToLiked(recommendation)"
                  :disabled="submittingFeedback"
                  class="preference-btn like-btn"
                >
                  👍 Like
                </button>
                <button
                  @click="addToDisliked(recommendation)"
                  :disabled="submittingFeedback"
                  class="preference-btn dislike-btn"
                >
                  👎 Dislike
                </button>
              </div>

              <!-- Feedback message -->
              <div v-if="feedbackMessage" class="feedback-message">
                {{ feedbackMessage }}
              </div>
            </div>
          </section>
        </div>

        <section class="menu-section">
          <h3 class="menu-title">Full Menu</h3>
          <p class="menu-subtitle">Rate any dish to improve your future recommendations!</p>
          <div class="menu-grid">
            <div v-for="item in menuItems" :key="item.menuItem" class="menu-item-card">
              <h4 class="menu-item-name">{{ item.name }}</h4>
              <p class="menu-item-description">{{ item.description }}</p>
              <p class="menu-item-price">${{ item.price.toFixed(2) }}</p>

              <!-- Star rating for menu items -->
              <div class="menu-item-actions">
                <div class="menu-star-rating">
                  <button
                    v-for="star in 6"
                    :key="star - 1"
                    @click="submitStarRating(item.name, star - 1, item.menuItem)"
                    :disabled="submittingFeedback"
                    class="menu-star-btn"
                    :title="`${star - 1} star${star - 1 !== 1 ? 's' : ''}`"
                  >
                    {{ star - 1 }}⭐
                  </button>
                </div>

                <!-- Like/Dislike buttons -->
                <div class="menu-preference-buttons">
                  <button
                    @click="addToLiked(item.name, item.menuItem)"
                    :disabled="submittingFeedback"
                    class="menu-pref-btn like"
                    title="Add to liked"
                  >
                    👍
                  </button>
                  <button
                    @click="addToDisliked(item.name, item.menuItem)"
                    :disabled="submittingFeedback"
                    class="menu-pref-btn dislike"
                    title="Add to disliked"
                  >
                    👎
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>
    </main>
  </div>
</template>

<style scoped>
.restaurant-page {
  min-height: 100vh;
  width: 100vw;
  background: #fefae0;
  font-family: 'Montserrat', sans-serif;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 1rem 0;
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
}

.nav-link {
  background: none;
  border: 2px solid #606c38;
  color: #606c38;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 800;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
}

.profile-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.hero-section {
  text-align: center;
  margin: 3rem auto;
  padding: 2rem;
}

.hero-title {
  font-size: 3rem;
  color: #606c38;
  margin-bottom: 1rem;
  font-weight: 800;
}

.hero-subtitle {
  font-size: 1.3rem;
  color: #606c38;
  margin-bottom: 2rem;
}

.recommendation-card {
  background: #606c38;
  margin: 0 auto 3rem;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 700px;
  text-align: center;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.recommendation-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}

.recommendation-card h3 {
  color: white;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.recommendation-text {
  font-size: 2rem;
  color: white;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 8px;
  margin: 0 0 2rem 0;
}

.feedback-section {
  margin-top: 2rem;
}

.feedback-prompt,
.preference-prompt {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin-bottom: 1rem;
  margin-top: 1.5rem;
}

.preference-prompt {
  margin-top: 2rem;
}

.star-rating {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.star-btn {
  padding: 0.75rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.star-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
}

.star-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.preference-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.preference-btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  color: white;
}

.preference-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.preference-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.preference-btn.like-btn {
  background: #606c38;
  border: 2px solid #4a5a2a;
  box-shadow: 0 2px 4px rgba(96, 108, 56, 0.3);
}

.preference-btn.like-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 1);
  border-style: solid;
  color: #606c38;
}

.preference-btn.dislike-btn {
  background: #606c38;
  border: 2px solid #4a5a2a;
  box-shadow: 0 2px 4px rgba(96, 108, 56, 0.3);
}

.preference-btn.dislike-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 1);
  border-style: solid;
  color: #606c38;
}

.feedback-message {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.95);
  color: #606c38;
  border-radius: 8px;
  font-weight: 600;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.menu-section {
  max-width: 900px;
  margin: 0 auto 4rem;
  padding: 0 2rem;
}

.menu-title {
  font-size: 2rem;
  color: #606c38;
  text-align: center;
  margin-bottom: 0.5rem;
  font-weight: 800;
}

.menu-subtitle {
  text-align: center;
  color: #666;
  font-size: 1rem;
  margin-bottom: 2rem;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.menu-item-card {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.menu-item-card:hover {
  transform: translateY(-5px);
}

.menu-item-name {
  color: #606c38;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.menu-item-description {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.menu-item-price {
  color: #99ac5d;
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.menu-item-actions {
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.menu-star-rating {
  display: flex;
  gap: 0.25rem;
  justify-content: center;
  flex-wrap: wrap;
}

.menu-star-btn {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  padding: 0.4rem 0.6rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #606c38;
}

.menu-star-btn:hover:not(:disabled) {
  transform: scale(1.05);
  border-color: #606c38;
  background: rgba(96, 108, 56, 0.1);
}

.menu-star-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.menu-preference-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.menu-pref-btn {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-pref-btn:hover:not(:disabled) {
  transform: scale(1.1);
}

.menu-pref-btn.like:hover:not(:disabled) {
  border-color: #606c38;
  background: rgba(96, 108, 56, 0.15);
  border-width: 3px;
}

.menu-pref-btn.dislike:hover:not(:disabled) {
  border-color: rgba(96, 108, 56, 0.6);
  background: rgba(255, 255, 255, 0.9);
}

.menu-pref-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  color: #606c38;
  margin-top: 2rem;
}

.error-not-found,
.error {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem;
}

.error-content {
  text-align: center;
  max-width: 500px;
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.error-emoji {
  font-size: 5rem;
  margin-bottom: 1rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.error-title {
  font-size: 2rem;
  color: #606c38;
  margin-bottom: 1rem;
  font-weight: 800;
}

.error-message {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.error-message strong {
  color: #606c38;
  font-weight: 700;
}

.error-suggestion {
  font-size: 1rem;
  color: #888;
  margin-bottom: 2rem;
  font-style: italic;
}

.error-button {
  background: #606c38;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.error-button:hover {
  background: #99ac5d;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(96, 108, 56, 0.3);
}
</style>
