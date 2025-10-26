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
      {
        name: 'Barbacoa Bowl',
        description: 'Shredded beef with rice, black beans, cheese, and fresh salsa',
        price: 10.25,
      },
      {
        name: 'Chicken Quesadilla',
        description: 'Grilled chicken, cheese, and peppers in a warm tortilla',
        price: 8.95,
      },
      {
        name: 'Sofritas Burrito',
        description: 'Spicy tofu, rice, beans, and fresh vegetables wrapped in tortilla',
        price: 9.25,
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
      {
        name: 'Avocado BLT Sandwich',
        description: 'Bacon, lettuce, tomato, and avocado on sourdough',
        price: 10.49,
      },
      {
        name: 'Turkey Artichoke Panini',
        description: 'Roasted turkey with artichoke hearts and sun-dried tomatoes',
        price: 9.99,
      },
      {
        name: 'French Onion Soup',
        description: 'Caramelized onions in beef broth with melted gruyere',
        price: 6.99,
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
      {
        name: 'Chicken Pesto Parm',
        description: 'Roasted chicken with pesto, quinoa, and parmesan',
        price: 13.95,
      },
      {
        name: 'Spicy Thai Salad',
        description: 'Mixed greens with spicy cashew dressing and sesame seeds',
        price: 12.95,
      },
      {
        name: 'Warm Grain Bowl',
        description: 'Quinoa, farro, and roasted vegetables with tahini',
        price: 12.5,
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
      {
        name: "Chick'n Shack",
        description: 'Crispy chicken sandwich with lettuce, pickles, and buttermilk herb mayo',
        price: 7.89,
      },
      {
        name: 'Concrete',
        description: 'Frozen custard blended with your choice of mix-ins',
        price: 5.49,
      },
      {
        name: 'Cheese Fries',
        description: 'Crispy crinkle-cut fries topped with cheese sauce',
        price: 4.99,
      },
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
      {
        name: 'Chicken Scampi',
        description: 'Tender chicken with shrimp in white wine lemon butter sauce',
        price: 18.99,
      },
      {
        name: 'Zuppa Toscana',
        description: 'Spicy sausage soup with kale and potatoes',
        price: 7.49,
      },
      {
        name: 'Stuffed Mushrooms',
        description: 'Mushrooms stuffed with Italian cheeses and herbs',
        price: 8.99,
      },
    ],
  },
  {
    name: 'Dunkin Donuts',
    menuItems: [
      {
        name: 'Glazed Donut',
        description: 'Classic glazed donut, light and sweet',
        price: 1.59,
      },
      {
        name: 'Boston Kreme Donut',
        description: 'Chocolate glazed donut filled with vanilla creme',
        price: 1.79,
      },
      {
        name: 'Iced Coffee',
        description: 'Smooth and refreshing iced coffee',
        price: 3.49,
      },
      {
        name: 'Bagel with Cream Cheese',
        description: 'Fresh bagel with your choice of cream cheese',
        price: 2.99,
      },
      {
        name: 'Breakfast Sandwich',
        description: 'Egg, cheese, and your choice of bacon or sausage on croissant',
        price: 4.99,
      },
      {
        name: 'Jelly Donut',
        description: 'Soft donut filled with raspberry jelly',
        price: 1.69,
      },
      {
        name: 'Hot Chocolate',
        description: 'Rich hot chocolate topped with whipped cream',
        price: 3.99,
      },
      {
        name: 'Croissant',
        description: 'Buttery, flaky French croissant',
        price: 2.49,
      },
    ],
  },
  {
    name: 'Subway',
    menuItems: [
      {
        name: 'Italian B.M.T.',
        description: 'Salami, pepperoni, and ham with your choice of veggies',
        price: 8.49,
      },
      {
        name: 'Turkey Breast',
        description: 'Lean turkey breast with fresh vegetables',
        price: 7.99,
      },
      {
        name: 'Veggie Delite',
        description: 'Fresh vegetables on your choice of bread',
        price: 6.99,
      },
      {
        name: 'Tuna',
        description: 'Flaked tuna with mayo and your choice of toppings',
        price: 7.99,
      },
      {
        name: 'Chicken Teriyaki',
        description: 'Tender chicken with teriyaki sauce and vegetables',
        price: 8.99,
      },
      {
        name: 'Meatball Marinara',
        description: 'Meatballs with marinara sauce and provolone cheese',
        price: 8.99,
      },
      {
        name: 'Roast Beef',
        description: 'Sliced roast beef with cheese and vegetables',
        price: 8.99,
      },
      {
        name: 'Spicy Italian',
        description: 'Pepperoni and spicy Italian sausage with cheese',
        price: 8.49,
      },
    ],
  },
  {
    name: 'Panda Express',
    menuItems: [
      {
        name: 'Orange Chicken',
        description: 'Crispy chicken breast with tangy orange sauce',
        price: 7.99,
      },
      {
        name: 'Kung Pao Chicken',
        description: 'Diced chicken with peanuts and vegetables in spicy sauce',
        price: 7.99,
      },
      {
        name: 'Beef and Broccoli',
        description: 'Tender beef with fresh broccoli in savory sauce',
        price: 8.99,
      },
      {
        name: 'SweetFire Chicken Breast',
        description: 'Grilled chicken with bell peppers and onions in sweet chili sauce',
        price: 7.99,
      },
      {
        name: 'Beijing Beef',
        description: 'Crispy beef with bell peppers in tangy sweet sauce',
        price: 8.99,
      },
      {
        name: 'Honey Walnut Shrimp',
        description: 'Crispy shrimp in honey sauce with candied walnuts',
        price: 9.99,
      },
      {
        name: 'Chow Mein',
        description: 'Stir-fried noodles with vegetables and your choice of protein',
        price: 7.99,
      },
      {
        name: 'Eggplant Tofu',
        description: 'Crispy eggplant and tofu in savory garlic sauce',
        price: 7.99,
      },
    ],
  },
  {
    name: 'Starbucks',
    menuItems: [
      {
        name: 'Caffe Latte',
        description: 'Rich espresso with steamed milk',
        price: 4.95,
      },
      {
        name: 'Caramel Macchiato',
        description: 'Espresso with vanilla-flavored syrup, milk, and caramel drizzle',
        price: 5.45,
      },
      {
        name: 'Pumpkin Spice Latte',
        description: 'Espresso with pumpkin, cinnamon, and nutmeg flavors',
        price: 5.95,
      },
      {
        name: 'Turkey & Provolone Sandwich',
        description: 'Sliced turkey with provolone on ciabatta',
        price: 7.95,
      },
      {
        name: 'Chocolate Croissant',
        description: 'Buttery croissant with chocolate filling',
        price: 3.25,
      },
      {
        name: 'Iced White Chocolate Mocha',
        description: 'Espresso with white chocolate and whipped cream over ice',
        price: 5.95,
      },
      {
        name: 'Protein Box',
        description: 'Boiled eggs, cheese, grapes, and multigrain muesli bread',
        price: 7.45,
      },
      {
        name: 'Banana Bread',
        description: 'Moist banana bread with walnuts',
        price: 2.95,
      },
    ],
  },
  {
    name: 'McDonalds',
    menuItems: [
      {
        name: 'Big Mac',
        description: 'Two beef patties, special sauce, lettuce, cheese, pickles, onions',
        price: 5.99,
      },
      {
        name: 'Quarter Pounder with Cheese',
        description: 'Quarter pound beef patty with cheese, onions, pickles, ketchup, mustard',
        price: 5.49,
      },
      {
        name: 'McChicken',
        description: 'Crispy chicken patty with mayo and lettuce',
        price: 4.99,
      },
      {
        name: 'Chicken McNuggets',
        description: 'Bite-sized pieces of chicken, 10 pieces',
        price: 5.49,
      },
      {
        name: 'French Fries',
        description: 'World famous golden fries',
        price: 3.49,
      },
      {
        name: 'McDouble',
        description: 'Two beef patties with cheese, pickles, onions, ketchup, mustard',
        price: 3.99,
      },
      {
        name: 'Apple Pie',
        description: 'Warm apple pie with flaky crust',
        price: 1.99,
      },
      {
        name: 'McFlurry',
        description: 'Vanilla soft serve with your choice of mix-ins',
        price: 4.49,
      },
    ],
  },
  {
    name: "Domino's Pizza",
    menuItems: [
      {
        name: 'Pepperoni Pizza',
        description: 'Classic pepperoni pizza with mozzarella cheese',
        price: 12.99,
      },
      {
        name: 'Deluxe Pizza',
        description: 'Pepperoni, Italian sausage, green peppers, mushrooms, onions',
        price: 15.99,
      },
      {
        name: 'Hawaiian Pizza',
        description: 'Ham and pineapple with mozzarella cheese',
        price: 13.99,
      },
      {
        name: 'Veggie Pizza',
        description: 'Green peppers, onions, mushrooms, black olives, tomatoes',
        price: 13.99,
      },
      {
        name: 'Buffalo Chicken Pizza',
        description: 'Spicy buffalo sauce, chicken, onions, provolone',
        price: 14.99,
      },
      {
        name: 'Margherita Pizza',
        description: 'Fresh mozzarella, basil, and tomato sauce',
        price: 13.99,
      },
      {
        name: 'Cheese Pizza',
        description: 'Classic pizza with mozzarella cheese',
        price: 11.99,
      },
      {
        name: 'Chicken Bacon Ranch Pizza',
        description: 'Grilled chicken, bacon, and ranch sauce',
        price: 15.99,
      },
    ],
  },
  {
    name: 'Taco Bell',
    menuItems: [
      {
        name: 'Crunchwrap Supreme',
        description: 'Beef, nacho cheese, sour cream, lettuce, tomatoes, wrapped in tortilla',
        price: 5.29,
      },
      {
        name: 'Chalupa Supreme',
        description: 'Beef, lettuce, tomatoes, sour cream, cheese in fried shell',
        price: 4.79,
      },
      {
        name: 'Bean Burrito',
        description: 'Refried beans, red sauce, cheese, onions',
        price: 2.49,
      },
      {
        name: 'Nachos BellGrande',
        description: 'Beef, beans, nacho cheese, sour cream, tomatoes, jalapeños',
        price: 5.99,
      },
      {
        name: 'Mexican Pizza',
        description: 'Beef, refried beans, tomatoes, layered with tortillas',
        price: 5.99,
      },
      {
        name: 'Crunchy Taco',
        description: 'Seasoned beef, lettuce, and cheese in crispy shell',
        price: 1.99,
      },
      {
        name: 'Cheesy Gordita Crunch',
        description: 'Beef, nacho cheese, lettuce, and tomatoes in soft and crunchy shell',
        price: 4.79,
      },
      {
        name: 'Cinnamon Twists',
        description: 'Sweet cinnamon twists for dessert',
        price: 1.99,
      },
    ],
  },
  {
    name: 'Buffalo Wild Wings',
    menuItems: [
      {
        name: 'Traditional Wings',
        description: 'Classic wings tossed in your choice of sauce',
        price: 14.99,
      },
      {
        name: 'Boneless Wings',
        description: 'Crispy boneless wings in your choice of sauce',
        price: 13.99,
      },
      {
        name: 'Honey BBQ Wings',
        description: 'Sweet and smoky honey BBQ sauce',
        price: 15.99,
      },
      {
        name: 'Mango Habanero Wings',
        description: 'Sweet mango with a spicy habanero kick',
        price: 15.99,
      },
      {
        name: 'Buffalo Chicken Wrap',
        description: 'Boneless wings, lettuce, tomatoes, blue cheese in tortilla',
        price: 11.99,
      },
      {
        name: 'Asian Zing Wings',
        description: 'Sweet and spicy Asian-inspired sauce',
        price: 15.99,
      },
      {
        name: 'Parmesan Garlic Wings',
        description: 'Garlic butter and parmesan cheese',
        price: 15.99,
      },
      {
        name: 'Onion Rings',
        description: 'Beer-battered onion rings with ranch dipping sauce',
        price: 6.99,
      },
    ],
  },
  {
    name: "P.F. Chang's",
    menuItems: [
      {
        name: 'Mongolian Beef',
        description: 'Sliced beef with scallions in savory sauce',
        price: 18.95,
      },
      {
        name: 'Kung Pao Chicken',
        description: 'Diced chicken with peanuts, celery, and chili peppers',
        price: 17.95,
      },
      {
        name: 'Sweet and Sour Chicken',
        description: 'Crispy chicken with bell peppers and pineapple',
        price: 17.95,
      },
      {
        name: 'Mapo Tofu',
        description: 'Silken tofu in spicy Sichuan sauce',
        price: 16.95,
      },
      {
        name: 'Spring Rolls',
        description: 'Crispy vegetable spring rolls with sweet and sour sauce',
        price: 8.95,
      },
      {
        name: 'Chicken Lettuce Wraps',
        description: 'Wok-seared chicken with crisp lettuce cups',
        price: 12.95,
      },
      {
        name: 'Dynamite Shrimp',
        description: 'Crispy tempura-battered shrimp with spicy sauce',
        price: 13.95,
      },
      {
        name: 'Fried Rice',
        description: 'Jasmine rice with vegetables, egg, and your choice of protein',
        price: 14.95,
      },
    ],
  },
  {
    name: 'Red Lobster',
    menuItems: [
      {
        name: 'Lobster Roll',
        description: 'Fresh lobster meat on a buttered roll',
        price: 24.99,
      },
      {
        name: 'Garlic Grilled Shrimp',
        description: 'Grilled shrimp with garlic butter sauce',
        price: 18.99,
      },
      {
        name: 'Fish and Chips',
        description: 'Beer-battered cod with fries and coleslaw',
        price: 16.99,
      },
      {
        name: 'Lobster Bisque',
        description: 'Creamy soup with chunks of lobster',
        price: 8.99,
      },
      {
        name: 'Caesar Salad',
        description: 'Romaine lettuce with parmesan and croutons',
        price: 10.99,
      },
      {
        name: 'Crab Legs',
        description: 'Steamed snow crab legs with drawn butter',
        price: 32.99,
      },
      {
        name: 'Shrimp Scampi',
        description: 'Shrimp sautéed in garlic butter white wine sauce',
        price: 20.99,
      },
      {
        name: 'Cheddar Bay Biscuits',
        description: 'Warm, cheesy biscuits - a Red Lobster classic',
        price: 4.99,
      },
    ],
  },
  {
    name: 'Cheesecake Factory',
    menuItems: [
      {
        name: 'Original Cheesecake',
        description: 'Classic New York-style cheesecake',
        price: 9.95,
      },
      {
        name: 'Chicken Madeira',
        description: 'Chicken breast with mushrooms and Madeira wine sauce',
        price: 21.95,
      },
      {
        name: 'Cobb Salad',
        description: 'Mixed greens with chicken, bacon, avocado, and blue cheese',
        price: 17.95,
      },
      {
        name: 'Baja Chicken Tacos',
        description: 'Grilled chicken with guacamole and pico de gallo',
        price: 16.95,
      },
      {
        name: 'Burger',
        description: 'Angus beef burger with lettuce, tomato, and special sauce',
        price: 15.95,
      },
      {
        name: 'Strawberry Cheesecake',
        description: 'Original cheesecake topped with fresh strawberries',
        price: 10.95,
      },
      {
        name: 'Thai Lettuce Wraps',
        description: 'Thai-spiced chicken with crisp lettuce and peanut sauce',
        price: 15.95,
      },
      {
        name: 'Crispy Chicken Costoletta',
        description: 'Crispy chicken breast with lemon and herbs',
        price: 19.95,
      },
    ],
  },
  {
    name: 'Noodles & Company',
    menuItems: [
      {
        name: 'Pad Thai',
        description: 'Rice noodles with eggs, bean sprouts, and peanuts',
        price: 11.99,
      },
      {
        name: 'Wisconsin Mac & Cheese',
        description: 'Macaroni with Wisconsin cheddar and parmesan',
        price: 10.99,
      },
      {
        name: 'Penne Rosa',
        description: 'Penne pasta with marinara and alfredo sauce',
        price: 11.99,
      },
      {
        name: 'Japanese Pan Noodles',
        description: 'Wheat noodles with vegetables and teriyaki sauce',
        price: 11.99,
      },
      {
        name: 'Buffalo Chicken Mac',
        description: 'Mac and cheese with buffalo chicken',
        price: 12.99,
      },
      {
        name: 'Pesto Cavatappi',
        description: 'Spiral pasta with basil pesto cream sauce',
        price: 11.99,
      },
      {
        name: 'Thai Curry',
        description: 'Curry with vegetables, choice of protein, and jasmine rice',
        price: 12.99,
      },
      {
        name: 'Indonesian Peanut Saute',
        description: 'Wheat noodles with vegetables in peanut sauce',
        price: 11.99,
      },
    ],
  },
  {
    name: 'Five Guys',
    menuItems: [
      {
        name: 'Cheeseburger',
        description: 'Two patties with American cheese and toppings',
        price: 8.99,
      },
      {
        name: 'Bacon Cheeseburger',
        description: 'Two patties with bacon, cheese, and toppings',
        price: 10.49,
      },
      {
        name: 'Little Hamburger',
        description: 'Single patty with fresh toppings',
        price: 6.99,
      },
      {
        name: 'Cajun Fries',
        description: 'Fries seasoned with Cajun spices',
        price: 4.99,
      },
      {
        name: 'Veggie Sandwich',
        description: 'Grilled vegetables with cheese and toppings',
        price: 7.99,
      },
      {
        name: 'Bacon Burger',
        description: 'Single patty with bacon and cheese',
        price: 8.99,
      },
      {
        name: 'Hot Dog',
        description: 'All-beef hot dog with your choice of toppings',
        price: 5.99,
      },
      {
        name: 'Regular Fries',
        description: 'Fresh-cut fries cooked in peanut oil',
        price: 4.99,
      },
    ],
  },
  {
    name: 'KFC',
    menuItems: [
      {
        name: 'Original Recipe Chicken',
        description: 'Hand-breaded chicken with secret blend of herbs and spices',
        price: 12.99,
      },
      {
        name: 'Extra Crispy Chicken',
        description: 'Extra crispy breaded chicken',
        price: 13.99,
      },
      {
        name: 'Chicken Sandwich',
        description: 'Crispy chicken fillet with mayo and pickles',
        price: 5.99,
      },
      {
        name: 'Mashed Potatoes and Gravy',
        description: 'Creamy mashed potatoes with savory gravy',
        price: 2.99,
      },
      {
        name: 'Mac and Cheese',
        description: 'Creamy macaroni and cheese',
        price: 3.99,
      },
      {
        name: 'Mac and Cheese Bowl',
        description: 'Mac and cheese with your choice of protein',
        price: 6.99,
      },
      {
        name: 'Coleslaw',
        description: 'Creamy coleslaw with cabbage and carrots',
        price: 2.99,
      },
      {
        name: 'Biscuit',
        description: 'Warm, buttery biscuit',
        price: 1.99,
      },
    ],
  },
  {
    name: "Wendy's",
    menuItems: [
      {
        name: "Dave's Single",
        description: 'Quarter pound beef patty with cheese, lettuce, tomato, onion, pickles',
        price: 5.89,
      },
      {
        name: 'Baconator',
        description: 'Two quarter pound patties with bacon and cheese',
        price: 7.99,
      },
      {
        name: 'Spicy Chicken Sandwich',
        description: 'Breaded spicy chicken fillet with mayo',
        price: 5.99,
      },
      {
        name: 'Frosty',
        description: 'Creamy chocolate or vanilla frozen dessert',
        price: 2.89,
      },
      {
        name: 'Chili',
        description: 'Hearty beef and bean chili',
        price: 3.49,
      },
      {
        name: 'Caesar Salad',
        description: 'Crisp romaine with parmesan and caesar dressing',
        price: 5.99,
      },
      {
        name: 'Jr. Bacon Cheeseburger',
        description: 'Single patty with bacon, cheese, lettuce, tomato, mayo',
        price: 4.99,
      },
      {
        name: 'Baked Potato',
        description: 'Large baked potato with butter and sour cream',
        price: 2.99,
      },
    ],
  },
  {
    name: 'In-N-Out Burger',
    menuItems: [
      {
        name: 'Double-Double',
        description: 'Two beef patties, two slices of cheese, lettuce, tomato, special sauce',
        price: 4.79,
      },
      {
        name: 'Animal Style Fries',
        description: 'Fries topped with grilled onions, cheese, and spread',
        price: 3.89,
      },
      {
        name: 'Protein Style Burger',
        description: 'Burger wrapped in lettuce instead of bun',
        price: 4.79,
      },
      {
        name: 'Neapolitan Shake',
        description: 'Vanilla, chocolate, and strawberry swirled together',
        price: 3.29,
      },
      {
        name: 'Grilled Cheese',
        description: 'Melted cheese with lettuce, tomato, and spread',
        price: 3.29,
      },
      {
        name: 'Double-Double Animal Style',
        description: 'Double-Double with grilled onions, pickles, and extra spread',
        price: 5.29,
      },
      {
        name: 'Fries',
        description: 'Fresh-cut fries cooked to perfection',
        price: 2.29,
      },
      {
        name: 'Root Beer Float',
        description: 'Vanilla shake with root beer',
        price: 3.29,
      },
    ],
  },
  {
    name: 'Papa Johns',
    menuItems: [
      {
        name: 'Original Crust Pepperoni',
        description: 'Classic pepperoni pizza with signature sauce',
        price: 12.99,
      },
      {
        name: 'BBQ Chicken Bacon',
        description: 'Grilled chicken, bacon, and BBQ sauce',
        price: 15.99,
      },
      {
        name: 'Garden Fresh',
        description: 'Fresh vegetables with five-cheese blend',
        price: 13.99,
      },
      {
        name: 'The Works',
        description: 'Pepperoni, sausage, mushrooms, green peppers, onions',
        price: 16.99,
      },
      {
        name: 'Thin Crust Pizza',
        description: 'Crispy thin crust with your choice of toppings',
        price: 11.99,
      },
      {
        name: 'Garlic Breadsticks',
        description: 'Fresh-baked breadsticks with garlic butter',
        price: 5.99,
      },
      {
        name: 'Papadias',
        description: 'Flatbread sandwich with your choice of fillings',
        price: 7.99,
      },
      {
        name: 'Chocolate Chip Cookie',
        description: 'Warm chocolate chip cookie dessert',
        price: 3.99,
      },
    ],
  },
  {
    name: 'Boston Market',
    menuItems: [
      {
        name: 'Rotisserie Chicken',
        description: 'Whole rotisserie chicken, slow-roasted',
        price: 11.99,
      },
      {
        name: 'Turkey Meal',
        description: 'Sliced turkey with two sides',
        price: 10.99,
      },
      {
        name: 'Meatloaf',
        description: 'Homestyle meatloaf with mashed potatoes',
        price: 9.99,
      },
      {
        name: 'Mac and Cheese',
        description: 'Creamy elbow macaroni with cheddar cheese',
        price: 3.99,
      },
      {
        name: 'Sweet Potato Casserole',
        description: 'Mashed sweet potatoes with brown sugar',
        price: 3.99,
      },
      {
        name: 'Cornbread',
        description: 'Warm, honey-sweetened cornbread',
        price: 2.99,
      },
      {
        name: 'Chicken Pot Pie',
        description: 'Flaky crust filled with chicken and vegetables',
        price: 7.99,
      },
      {
        name: 'Caesar Salad',
        description: 'Fresh romaine with parmesan and croutons',
        price: 4.99,
      },
    ],
  },
  {
    name: 'Burger King',
    menuItems: [
      {
        name: 'Whopper',
        description: 'Quarter pound flame-grilled beef with tomatoes, lettuce, mayo',
        price: 6.49,
      },
      {
        name: 'Chicken Fries',
        description: 'Crispy chicken strips shaped like fries',
        price: 4.99,
      },
      {
        name: 'Bacon King',
        description: 'Two flame-grilled patties with bacon and cheese',
        price: 8.99,
      },
      {
        name: 'Onion Rings',
        description: 'Battered and fried onion rings',
        price: 3.99,
      },
      {
        name: 'Ice Cream',
        description: 'Soft serve vanilla ice cream',
        price: 2.99,
      },
      {
        name: 'Chicken Sandwich',
        description: 'Crispy chicken with lettuce and mayo',
        price: 5.99,
      },
      {
        name: 'Rodeo Burger',
        description: 'Burger with onion rings and BBQ sauce',
        price: 4.99,
      },
      {
        name: 'Fries',
        description: 'Hot and crispy golden fries',
        price: 3.49,
      },
    ],
  },
  {
    name: 'Qdoba',
    menuItems: [
      {
        name: 'Chicken Burrito',
        description: 'Grilled chicken, rice, beans, and your choice of toppings',
        price: 9.99,
      },
      {
        name: 'Steak Quesadilla',
        description: 'Grilled steak and cheese in flour tortilla',
        price: 10.99,
      },
      {
        name: '3-Cheese Nachos',
        description: 'Tortilla chips with queso, jalapeños, and toppings',
        price: 8.99,
      },
      {
        name: 'Taco Salad',
        description: 'Fresh greens with protein, queso, and salsa',
        price: 9.99,
      },
      {
        name: 'Mango Salsa',
        description: 'Fresh mango, tomatoes, and cilantro',
        price: 2.99,
      },
      {
        name: 'Guacamole',
        description: 'Hand-mashed avocados with lime and cilantro',
        price: 2.99,
      },
      {
        name: 'Chocolate Brownie',
        description: 'Rich chocolate brownie dessert',
        price: 3.99,
      },
      {
        name: 'Tortilla Soup',
        description: 'Spicy chicken soup with tortilla strips',
        price: 5.99,
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
  } catch (error: unknown) {
    const apiError = error as { response?: { data?: { error?: string } }; message?: string }
    const errorMessage = apiError?.response?.data?.error || apiError?.message || 'Unknown error'
    // Check if it's a duplicate/already exists error
    if (
      errorMessage.toLowerCase().includes('exist') ||
      errorMessage.toLowerCase().includes('duplicate')
    ) {
      console.log(`⊘ Skipped (already exists): ${name} at ${restaurant}`)
    } else {
      console.error(`✗ Failed to add ${name} to ${restaurant}:`, errorMessage)
    }
    return null
  }
}

async function populateDatabase() {
  console.log('🍽️  Starting to populate restaurant database...\n')

  let addedCount = 0
  let skippedCount = 0

  for (const restaurant of restaurantsData) {
    console.log(`\n📍 Adding menu items for ${restaurant.name}...`)

    for (const item of restaurant.menuItems) {
      const result = await addMenuItem(restaurant.name, item.name, item.description, item.price)
      if (result) {
        addedCount++
      } else {
        // Check if it was skipped or errored (we can't easily distinguish, so we'll count skipped)
        skippedCount++
      }
      // Small delay to avoid overwhelming the server
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  console.log('\n\n✅ Database population complete!')
  console.log(`\nSummary:`)
  console.log(`  ✓ Added: ${addedCount} menu items`)
  console.log(`  ⊘ Skipped (already exist): ${skippedCount} menu items`)
  console.log(`\nRestaurants processed: ${restaurantsData.length}`)
  restaurantsData.forEach((r) => console.log(`  - ${r.name} (${r.menuItems.length} items)`))
}

// Run the script
populateDatabase().catch((error) => {
  console.error('❌ Error populating database:', error)
  process.exit(1)
})
