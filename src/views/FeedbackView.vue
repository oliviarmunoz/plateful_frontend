<script setup lang="ts">
import { ref } from 'vue'
import { feedbackApi } from '@/api/Feedback'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = ref<User | null>(null)

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
  } catch (err) {}
}

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="feedback-page">
    <header class="feedback-header">
      <button class="back-button" @click="goBack">← Go Back</button>
      <h2 class="restaurant-name">{{ restaurantName }}</h2>
    </header>

    <section class="menu-section">
      <div v-for="dish in dishes" :key="dish.name" class="dish-card">
        <h3>{{ dish.name }}</h3>
        <p class="description">{{ dish.description }}</p>
        <p class="price">${{ dish.price }}</p>

        <div class="rating">
          <span
            v-for="star in 5"
            :key="star"
            class="star"
            :class="{ active: star <= (ratings[dish.name] || 0) }"
            @click="submitRating(dish.name, star)"
          >
            ★
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.feedback-page {
  padding: 2rem;
  background: #fefae0;
  min-height: 100vh;
}
.feedback-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}
.back-button {
  border: 2px solid #606c38;
  background: none;
  color: #606c38;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}
.back-button:hover {
  background: #606c38;
  color: white;
}
.dish-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}
.rating {
  font-size: 1.5rem;
  color: #ccc;
  cursor: pointer;
}
.star.active {
  color: #ffd700;
}
.price {
  color: #606c38;
  font-weight: bold;
}
</style>
