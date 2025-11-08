<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const showDropdown = ref(false)
const selectedIndex = ref(-1)
const searchInput = ref<HTMLInputElement | null>(null)

// List of available restaurants (extracted from populateRestaurants.ts)
const availableRestaurants = [
  'Chipotle',
  'Panera Bread',
  'Sweetgreen',
  'Shake Shack',
  'Olive Garden',
  'Dunkin Donuts',
  'Subway',
  'Panda Express',
  'Starbucks',
  'McDonalds',
  "Domino's Pizza",
  'Taco Bell',
  'Buffalo Wild Wings',
  "P.F. Chang's",
  'Red Lobster',
  'Cheesecake Factory',
  'Noodles & Company',
  'Five Guys',
  'KFC',
  "Wendy's",
  'In-N-Out Burger',
  'Papa Johns',
  'Boston Market',
  'Burger King',
  'Qdoba',
]

// Filtered restaurants based on search query
const filteredRestaurants = computed(() => {
  if (!searchQuery.value.trim()) return []

  const query = searchQuery.value.toLowerCase().trim()
  return availableRestaurants
    .filter((restaurant) => restaurant.toLowerCase().includes(query))
    .slice(0, 8) // Limit to 8 suggestions
})

// Redirect to login if not logged in
onMounted(() => {
  if (!localStorage.getItem('auth_token')) {
    router.push('/login')
  }

  // Load recent searches from localStorage
  loadRecentSearches()

  // Add click outside listener
  document.addEventListener('click', handleClickOutside)
})

// Clean up event listener
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    const restaurantName = searchQuery.value.trim()
    addToRecentSearches(restaurantName)
    router.push(`/restaurant/${encodeURIComponent(restaurantName)}`)
    showDropdown.value = false
  }
}

const selectRestaurant = (restaurant: string) => {
  searchQuery.value = restaurant
  showDropdown.value = false
  selectedIndex.value = -1
  addToRecentSearches(restaurant)
  router.push(`/restaurant/${encodeURIComponent(restaurant)}`)
}

const handleInput = () => {
  showDropdown.value = searchQuery.value.trim().length > 0
  selectedIndex.value = -1
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (!showDropdown.value) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, filteredRestaurants.value.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (selectedIndex.value >= 0) {
        const restaurant = filteredRestaurants.value[selectedIndex.value]
        if (restaurant) {
          selectRestaurant(restaurant)
          break
        }
      }
      handleSearch()
      break
    case 'Escape':
      showDropdown.value = false
      selectedIndex.value = -1
      break
  }
}

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.search-container')) {
    showDropdown.value = false
    selectedIndex.value = -1
  }
}

const goToProfile = () => {
  router.push('/profile')
}

// Popular restaurants for quick access
const popularRestaurants = [
  { name: 'Chipotle', category: 'Mexican' },
  { name: 'Starbucks', category: 'Coffee' },
  { name: 'McDonalds', category: 'Fast Food' },
  { name: 'Panda Express', category: 'Chinese' },
  { name: 'Subway', category: 'Sandwiches' },
  { name: "Domino's Pizza", category: 'Italian' },
]

// Recent searches (mock data for now)
const recentSearches = ref<string[]>([])

const selectPopularRestaurant = (restaurant: string) => {
  searchQuery.value = restaurant
  addToRecentSearches(restaurant)
  router.push(`/restaurant/${encodeURIComponent(restaurant)}`)
}

const addToRecentSearches = (restaurant: string) => {
  // Remove if already exists
  const index = recentSearches.value.indexOf(restaurant)
  if (index > -1) {
    recentSearches.value.splice(index, 1)
  }

  // Add to beginning
  recentSearches.value.unshift(restaurant)

  // Keep only last 5 searches
  if (recentSearches.value.length > 5) {
    recentSearches.value = recentSearches.value.slice(0, 5)
  }

  // Save to localStorage
  localStorage.setItem('plateful-recent-searches', JSON.stringify(recentSearches.value))
}

const loadRecentSearches = () => {
  const saved = localStorage.getItem('plateful-recent-searches')
  if (saved) {
    try {
      recentSearches.value = JSON.parse(saved)
    } catch {
      recentSearches.value = []
    }
  }
}

const clearRecentSearches = () => {
  recentSearches.value = []
  localStorage.removeItem('plateful-recent-searches')
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
                ref="searchInput"
                v-model="searchQuery"
                @input="handleInput"
                @keydown="handleKeyDown"
                @focus="showDropdown = searchQuery.trim().length > 0"
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

            <!-- Autocomplete Dropdown -->
            <div
              v-if="showDropdown && filteredRestaurants.length > 0"
              class="autocomplete-dropdown"
            >
              <ul class="suggestions-list">
                <li
                  v-for="(restaurant, index) in filteredRestaurants"
                  :key="restaurant"
                  @click="selectRestaurant(restaurant)"
                  :class="['suggestion-item', { selected: index === selectedIndex }]"
                >
                  {{ restaurant }}
                </li>
              </ul>
            </div>
          </form>
        </div>

        <!-- Popular Restaurants Section -->
        <div class="popular-section">
          <h3 class="section-title">Popular Restaurants</h3>
          <div class="popular-grid">
            <button
              v-for="restaurant in popularRestaurants"
              :key="restaurant.name"
              @click="selectPopularRestaurant(restaurant.name)"
              class="popular-item"
            >
              <div class="restaurant-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </div>
              <div class="restaurant-info">
                <span class="restaurant-name">{{ restaurant.name }}</span>
                <span class="restaurant-category">{{ restaurant.category }}</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Recent Searches Section -->
        <div v-if="recentSearches.length > 0" class="recent-section">
          <div class="recent-header">
            <h3 class="section-title">Recent Searches</h3>
            <button @click="clearRecentSearches" class="clear-button">Clear</button>
          </div>
          <div class="recent-list">
            <button
              v-for="search in recentSearches"
              :key="search"
              @click="selectPopularRestaurant(search)"
              class="recent-item"
            >
              <div class="recent-icon">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
              </div>
              <span class="recent-text">{{ search }}</span>
            </button>
          </div>
        </div>

        <!-- Features Section -->
        <div class="features-section">
          <h3 class="section-title">Why Choose Plateful?</h3>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h4>Personalized Recommendations</h4>
              <p>Get dish suggestions tailored to your taste preferences</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <polygon
                    points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                  />
                </svg>
              </div>
              <h4>Rate & Review</h4>
              <p>Share your dining experience and help others discover great food</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path
                    d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                  />
                  <polyline points="3.27,6.96 12,12.01 20.73,6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <h4>Discover New Places</h4>
              <p>Explore restaurants and cuisines you've never tried before</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  />
                  <path d="M8 12l2 2 4-4" />
                </svg>
              </div>
              <h4>Smart Filtering</h4>
              <p>Find exactly what you're craving with intelligent search and filters</p>
            </div>
          </div>
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
  margin-bottom: 6rem;
  padding: 3rem 0;
}

.hero-title {
  color: #606c38;
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #606c38 0%, #4a5a2a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  color: #606c38;
  font-size: 1.25rem;
  margin-bottom: 4rem;
  font-weight: 400;
  opacity: 0.8;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
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
  box-shadow: 0 8px 32px rgba(96, 108, 56, 0.12);
  border: 1px solid rgba(96, 108, 56, 0.1);
  backdrop-filter: blur(10px);
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
  background: linear-gradient(135deg, #606c38 0%, #4a5a2a 100%);
  border: none;
  color: white;
  padding: 1.5rem 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.search-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.search-button:hover::before {
  left: 100%;
}

.search-button:hover {
  background: linear-gradient(135deg, #4a5a2a 0%, #606c38 100%);
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(96, 108, 56, 0.3);
}

/* Autocomplete Dropdown Styles */
.search-container {
  position: relative;
}

.autocomplete-dropdown {
  position: absolute;
  top: calc(100% - 1px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 0 0 50px 50px;
  box-shadow: 0 8px 32px rgba(96, 108, 56, 0.15);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid rgba(96, 108, 56, 0.1);
  border-top: none;
}

.suggestions-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.suggestion-item {
  padding: 1rem 2rem;
  cursor: pointer;
  font-size: 1.2rem;
  color: #606c38;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
}

.suggestion-item:last-child {
  border-bottom: none;
  border-radius: 0 0 50px 50px;
}

.suggestion-item:hover,
.suggestion-item.selected {
  background-color: rgba(96, 108, 56, 0.05);
  color: #4a5a2a;
}

.suggestion-item.selected {
  background-color: rgba(96, 108, 56, 0.1);
  font-weight: 500;
}

/* Popular Restaurants Section */
.popular-section {
  margin-top: 5rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.section-title {
  color: #606c38;
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
  letter-spacing: -0.01em;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #606c38, #4a5a2a);
  border-radius: 2px;
}

.popular-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.popular-item {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(96, 108, 56, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;
  position: relative;
  overflow: hidden;
}

.popular-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(96, 108, 56, 0.05) 0%, rgba(74, 90, 42, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.popular-item:hover::before {
  opacity: 1;
}

.popular-item:hover {
  border-color: rgba(96, 108, 56, 0.3);
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 12px 40px rgba(96, 108, 56, 0.15);
}

.restaurant-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  color: rgba(96, 108, 56, 0.7);
}

.restaurant-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.restaurant-name {
  font-weight: 600;
  color: #606c38;
  font-size: 1.1rem;
  position: relative;
  z-index: 1;
}

.restaurant-category {
  color: rgba(96, 108, 56, 0.6);
  font-size: 0.85rem;
  font-weight: 400;
  position: relative;
  z-index: 1;
}

/* Recent Searches Section */
.recent-section {
  margin-top: 4rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.recent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.clear-button {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;
}

.clear-button:hover {
  color: #606c38;
}

.recent-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.recent-item {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(96, 108, 56, 0.15);
  border-radius: 25px;
  padding: 0.75rem 1.25rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.recent-item:hover {
  border-color: rgba(96, 108, 56, 0.3);
  background-color: rgba(96, 108, 56, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(96, 108, 56, 0.1);
}

.recent-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(96, 108, 56, 0.6);
}

.recent-text {
  color: #606c38;
  font-size: 0.9rem;
}

/* Features Section */
.features-section {
  margin-top: 6rem;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 4rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2.5rem;
  margin-top: 3rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(96, 108, 56, 0.1);
  border-radius: 24px;
  padding: 2.5rem;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(96, 108, 56, 0.03) 0%, rgba(74, 90, 42, 0.03) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-card:hover {
  border-color: rgba(96, 108, 56, 0.2);
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 60px rgba(96, 108, 56, 0.12);
}

.feature-icon {
  margin-bottom: 1.5rem;
  color: #606c38;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-card h4 {
  color: #606c38;
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  position: relative;
  z-index: 1;
}

.feature-card p {
  color: rgba(96, 108, 56, 0.7);
  line-height: 1.6;
  font-size: 0.95rem;
  position: relative;
  z-index: 1;
}
</style>
