# Database Population Scripts

## Populate Restaurants

This script adds sample restaurants and menu items to your backend database.

### Usage

```bash
npm run populate
```

### What it does

The script will attempt to add menu items for the restaurants in `populateRestaurants.ts`

### Troubleshooting

If you get "internal server error":

1. **Check your backend is running** at `http://localhost:8000/api`
2. **Verify the Restaurant concept** - Your backend may need restaurants to be created first before adding menu items
3. **Check the restaurant field** - The backend might expect a specific format for the restaurant identifier

According to the RestaurantMenu spec, `addMenuItem` requires:

- `restaurant`: Restaurant identifier (name or ID)
- `name`: Menu item name
- `description`: Menu item description
- `price`: Menu item price (Number)

Make sure your backend is set up to handle these requests correctly.
