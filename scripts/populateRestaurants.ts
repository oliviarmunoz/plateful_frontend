import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

// Sample restaurant data
const restaurantsData = [
  {
    name: 'Chipotle',
    menuItems: [
      {
        name: 'Chicken Burrito Bowl',
        description: 'Grilled chicken with rice, beans, and fresh toppings',
        price: 9.5,
      },
      {
        name: 'Steak Burrito',
        description: 'Grilled steak wrapped in a warm tortilla with your choice of toppings',
        price: 10.75,
      },
      {
        name: 'Carnitas Tacos',
        description: 'Slow-cooked pork in soft corn tortillas',
        price: 8.95,
      },
      {
        name: 'Veggie Bowl',
        description: 'Sofritas tofu with fajita vegetables, rice, and beans',
        price: 8.75,
      },
      {
        name: 'Chips and Guacamole',
        description: 'Fresh-made tortilla chips with house-made guacamole',
        price: 4.5,
      },
    ],
  },
  {
    name: 'Panera Bread',
    menuItems: [
      {
        name: 'Mac and Cheese',
        description: 'Creamy Vermont white cheddar mac and cheese',
        price: 7.99,
      },
      {
        name: 'Broccoli Cheddar Soup',
        description: 'Rich and creamy soup with fresh broccoli',
        price: 6.49,
      },
      {
        name: 'Mediterranean Veggie Sandwich',
        description: 'Hummus, feta, cucumbers, tomatoes on tomato basil bread',
        price: 9.29,
      },
      {
        name: 'Caesar Salad',
        description: 'Romaine lettuce with parmesan and homemade croutons',
        price: 8.79,
      },
      {
        name: 'Chocolate Chip Cookie',
        description: 'Freshly baked chocolate chip cookie',
        price: 2.99,
      },
    ],
  },
  {
    name: 'Sweetgreen',
    menuItems: [
      {
        name: 'Harvest Bowl',
        description: 'Warm wild rice with roasted chicken and sweet potato',
        price: 13.5,
      },
      { name: 'Kale Caesar', description: 'Kale and romaine with parmesan crisps', price: 11.95 },
      {
        name: 'Shroomami',
        description: 'Roasted portobello mushrooms with wild rice',
        price: 12.5,
      },
      {
        name: 'Fish Taco Bowl',
        description: 'Blackened fish with warm quinoa and lime',
        price: 14.25,
      },
      {
        name: 'Guacamole Greens',
        description: 'Fresh greens with guacamole and tortilla chips',
        price: 11.75,
      },
    ],
  },
  {
    name: 'Shake Shack',
    menuItems: [
      {
        name: 'ShackBurger',
        description: 'Cheeseburger with lettuce, tomato, ShackSauce',
        price: 6.89,
      },
      {
        name: 'SmokeShack',
        description: 'Burger with bacon, cherry peppers, ShackSauce',
        price: 8.69,
      },
      {
        name: 'Shroom Burger',
        description: 'Crispy fried portobello mushroom with cheese',
        price: 7.79,
      },
      { name: 'Crinkle Cut Fries', description: 'Classic crinkle cut fries', price: 3.99 },
      { name: 'Chocolate Shake', description: 'Hand-spun chocolate milkshake', price: 5.99 },
    ],
  },
  {
    name: 'Olive Garden',
    menuItems: [
      {
        name: 'Fettuccine Alfredo',
        description: 'Creamy parmesan sauce over fettuccine pasta',
        price: 15.99,
      },
      {
        name: 'Chicken Parmigiana',
        description: 'Breaded chicken breast with marinara and mozzarella',
        price: 17.49,
      },
      {
        name: 'Tour of Italy',
        description: 'Lasagna, fettuccine alfredo, and chicken parmigiana',
        price: 20.99,
      },
      {
        name: 'Minestrone Soup',
        description: 'Fresh vegetables, beans, and pasta in a tomato broth',
        price: 6.99,
      },
      {
        name: 'Tiramisu',
        description: 'Classic Italian dessert with espresso-soaked ladyfingers',
        price: 7.99,
      },
    ],
  },
]

async function addMenuItem(restaurant: string, name: string, description: string, price: number) {
  try {
    const response = await axios.post(`${API_BASE_URL}/RestaurantMenu/addMenuItem`, {
      restaurant,
      name,
      description,
      price,
    })
    console.log(`✓ Added: ${name} to ${restaurant}`)
    return response.data
  } catch (error: any) {
    console.error(
      `✗ Failed to add ${name} to ${restaurant}:`,
      error.response?.data?.error || error.message,
    )
    return null
  }
}

async function populateDatabase() {
  console.log('🍽️  Starting to populate restaurant database...\n')

  for (const restaurant of restaurantsData) {
    console.log(`\n📍 Adding menu items for ${restaurant.name}...`)

    for (const item of restaurant.menuItems) {
      await addMenuItem(restaurant.name, item.name, item.description, item.price)
      // Small delay to avoid overwhelming the server
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  console.log('\n\n✅ Database population complete!')
  console.log(`\nAdded ${restaurantsData.length} restaurants with their menu items:`)
  restaurantsData.forEach((r) => console.log(`  - ${r.name} (${r.menuItems.length} items)`))
}

// Run the script
populateDatabase().catch((error) => {
  console.error('❌ Error populating database:', error)
  process.exit(1)
})
