# API Documentation

This folder contains all API-related code for communicating with the backend at `http://localhost:8000/api`.

## Structure

- `config.ts` - Axios configuration and interceptors
- `types.ts` - TypeScript interfaces for API requests/responses
- `auth.ts` - Authentication API endpoints
- `recipes.ts` - Recipe management API endpoints
- `index.ts` - Main exports for easy importing

## Usage Examples

### Authentication

```typescript
import { authApi } from '@/api'

// Login
const loginData = await authApi.login({
  username: 'user@example.com',
  password: 'password123',
})

// Register
const registerData = await authApi.register({
  username: 'newuser',
  email: 'newuser@example.com',
  password: 'password123',
})
```

### Recipes

```typescript
import { recipesApi } from '@/api'

// Get all recipes
const recipes = await recipesApi.getRecipes({
  page: 1,
  limit: 10,
  cuisine_type: 'italian',
})

// Create a new recipe
const newRecipe = await recipesApi.createRecipe({
  title: 'Pasta Carbonara',
  ingredients: ['pasta', 'eggs', 'cheese'],
  instructions: ['Boil pasta', 'Mix eggs and cheese', 'Combine'],
})
```

### Error Handling

```typescript
import { authApi, type ApiError } from '@/api'

try {
  const result = await authApi.login(credentials)
  console.log('Login successful:', result.data)
} catch (error) {
  const apiError = error as ApiError
  console.error('Login failed:', apiError.message)
}
```

## Configuration

The API client is configured with:

- Base URL: `http://localhost:8000/api`
- Timeout: 10 seconds
- Automatic token handling via interceptors
- Error handling for 401 responses

## Adding New Endpoints

1. Add types to `types.ts`
2. Create API functions in appropriate service file
3. Export from `index.ts`
4. Update this README with usage examples
