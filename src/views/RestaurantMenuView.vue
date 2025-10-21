<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { restaurantMenuApi, feedbackApi, userTastePreferencesApi, type User } from '@/api'

const route = useRoute()
const router = useRouter()
const restaurantName = decodeURIComponent(route.params.name as string)

const menuItems = ref<{ name: string; description: string; price: number }[]>([])
const recommendation = ref('')
const loading = ref(true)
const error = ref('')
const user = ref<User | null>(null)
const feedbackMessage = ref('')
const submittingFeedback = ref(false)
const getCurrentUser = () => {
  const userData = localStorage.getItem('user')
  if (userData) {
    return JSON.parse(userData)
  }
  return null
}
user.value = getCurrentUser()

onMounted(async () => {
  try {
    loading.value = true
    error.value = ''

    const userId = user.value?.id?.toString()
    if (!userId) {
      router.push('/login')
      return
    }

    // Fetch menu items
    const menuResponse = await restaurantMenuApi._getMenuItems(restaurantName)
    if (Array.isArray(menuResponse) && menuResponse.length > 0 && 'error' in menuResponse[0]) {
      error.value = menuResponse[0].error
    } else if (Array.isArray(menuResponse)) {
      menuItems.value = menuResponse as { name: string; description: string; price: number }[]
    }

    // Fetch recommendation
    try {
      const recResponse = await restaurantMenuApi._getRecommendation(restaurantName, userId)
      if (Array.isArray(recResponse) && recResponse.length > 0 && !('error' in recResponse[0])) {
        recommendation.value = recResponse[0].recommendation
      }
    } catch (recErr) {
      // If recommendation fails, still show the menu
      console.log('Could not get recommendation:', recErr)
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

// Submit feedback for a dish
const submitFeedback = async (dishName: string, rating: number) => {
  if (!user.value?.id) {
    router.push('/login')
    return
  }

  try {
    submittingFeedback.value = true
    feedbackMessage.value = ''

    const userId = user.value.id.toString()

    // Submit feedback (0-5 rating)
    await feedbackApi.submitFeedback({
      author: userId,
      item: dishName,
      rating: rating,
    })

    // Based on rating, add to liked or disliked
    if (rating >= 4) {
      // High rating (4-5) = liked
      await userTastePreferencesApi.addLikedDish(userId, dishName)
      feedbackMessage.value = `✓ Added "${dishName}" to your liked dishes!`
    } else if (rating <= 2) {
      // Low rating (0-2) = disliked
      await userTastePreferencesApi.addDislikedDish(userId, dishName)
      feedbackMessage.value = `✓ Added "${dishName}" to your disliked dishes!`
    } else {
      // Neutral rating (3) = just feedback, no preference
      feedbackMessage.value = `✓ Thanks for your feedback on "${dishName}"!`
    }

    // Clear message after 3 seconds
    setTimeout(() => {
      feedbackMessage.value = ''
    }, 3000)
  } catch (err: unknown) {
    const apiErr = err as { response?: { data?: { error?: string } } }
    feedbackMessage.value = `Error: ${apiErr?.response?.data?.error || 'Failed to submit feedback'}`
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
      <div class="hero-section">
        <h2 class="hero-title">{{ restaurantName }}</h2>
        <p class="hero-subtitle">Explore the menu and see your personalized recommendation!</p>
      </div>

      <section class="recommendation-card" v-if="recommendation">
        <h3>Your Dish Recommendation 🍽️</h3>
        <p class="recommendation-text">{{ recommendation }}</p>

        <!-- Feedback buttons -->
        <div class="feedback-section">
          <p class="feedback-prompt">How do you feel about this recommendation?</p>
          <div class="feedback-buttons">
            <button
              @click="submitFeedback(recommendation, 5)"
              :disabled="submittingFeedback"
              class="feedback-btn love-btn"
              title="Love it! (5 stars)"
            >
              😍 Love it
            </button>
            <button
              @click="submitFeedback(recommendation, 4)"
              :disabled="submittingFeedback"
              class="feedback-btn like-btn"
              title="Like it (4 stars)"
            >
              👍 Like it
            </button>
            <button
              @click="submitFeedback(recommendation, 3)"
              :disabled="submittingFeedback"
              class="feedback-btn neutral-btn"
              title="It's okay (3 stars)"
            >
              😐 It's okay
            </button>
            <button
              @click="submitFeedback(recommendation, 2)"
              :disabled="submittingFeedback"
              class="feedback-btn dislike-btn"
              title="Not for me (2 stars)"
            >
              👎 Not for me
            </button>
            <button
              @click="submitFeedback(recommendation, 1)"
              :disabled="submittingFeedback"
              class="feedback-btn hate-btn"
              title="Dislike (1 star)"
            >
              😞 Dislike
            </button>
          </div>

          <!-- Feedback message -->
          <div v-if="feedbackMessage" class="feedback-message">
            {{ feedbackMessage }}
          </div>
        </div>
      </section>

      <section v-if="loading" class="loading">Loading menu...</section>

      <section v-else-if="error" class="error">
        {{ error }}
      </section>

      <section v-else class="menu-section">
        <h3 class="menu-title">Full Menu</h3>
        <p class="menu-subtitle">Rate any dish to improve your future recommendations!</p>
        <div class="menu-grid">
          <div v-for="item in menuItems" :key="item.name" class="menu-item-card">
            <h4 class="menu-item-name">{{ item.name }}</h4>
            <p class="menu-item-description">{{ item.description }}</p>
            <p class="menu-item-price">${{ item.price.toFixed(2) }}</p>

            <!-- Quick feedback buttons for menu items -->
            <div class="quick-feedback">
              <button
                @click="submitFeedback(item.name, 5)"
                :disabled="submittingFeedback"
                class="quick-feedback-btn"
                title="Love it!"
              >
                😍
              </button>
              <button
                @click="submitFeedback(item.name, 4)"
                :disabled="submittingFeedback"
                class="quick-feedback-btn"
                title="Like it"
              >
                👍
              </button>
              <button
                @click="submitFeedback(item.name, 3)"
                :disabled="submittingFeedback"
                class="quick-feedback-btn"
                title="Neutral"
              >
                😐
              </button>
              <button
                @click="submitFeedback(item.name, 1)"
                :disabled="submittingFeedback"
                class="quick-feedback-btn"
                title="Dislike"
              >
                👎
              </button>
            </div>
          </div>
        </div>
      </section>
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

.feedback-prompt {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.feedback-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.feedback-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.feedback-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.feedback-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.love-btn:hover:not(:disabled) {
  background: #22c55e;
}

.like-btn:hover:not(:disabled) {
  background: #84cc16;
}

.neutral-btn:hover:not(:disabled) {
  background: #eab308;
}

.dislike-btn:hover:not(:disabled) {
  background: #f97316;
}

.hate-btn:hover:not(:disabled) {
  background: #ef4444;
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

.quick-feedback {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.quick-feedback-btn {
  background: none;
  border: 2px solid #e5e7eb;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-feedback-btn:hover:not(:disabled) {
  transform: scale(1.1);
  border-color: #606c38;
  background: rgba(96, 108, 56, 0.1);
}

.quick-feedback-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading,
.error {
  text-align: center;
  font-size: 1.2rem;
  color: #606c38;
  margin-top: 2rem;
}
</style>
