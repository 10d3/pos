import type { Category, MenuItem, Table } from "@/lib/types"

export const categories: Category[] = [
  { id: "breakfast", name: "Breakfast", icon: "☕", itemCount: 13 },
  { id: "soups", name: "Soups", icon: "🍜", itemCount: 8 },
  { id: "pasta", name: "Pasta", icon: "🍝", itemCount: 10 },
  { id: "sushi", name: "Sushi", icon: "🍣", itemCount: 15 },
  { id: "main", name: "Main course", icon: "🍲", itemCount: 7 },
  { id: "desserts", name: "Desserts", icon: "🧁", itemCount: 9 },
  { id: "drinks", name: "Drinks", icon: "☕", itemCount: 11 },
  { id: "alcohol", name: "Alcohol", icon: "🍷", itemCount: 12 },
]

export const menuItems: MenuItem[] = [
  { id: "fish-and-chips", name: "Fish and chips", price: 7.5, categoryId: "main" },
  { id: "roast-chicken", name: "Roast chicken", price: 12.75, categoryId: "main" },
  { id: "fillet-steak", name: "Fillet steak", price: 11.6, categoryId: "main" },
  { id: "beefsteak", name: "Beefsteak", price: 10.2, categoryId: "main" },
  { id: "roast-beef", name: "Roast beef", price: 10.5, categoryId: "main" },
  { id: "buffalo-wings", name: "Buffalo wings", price: 8.85, categoryId: "main" },
  { id: "lobster", name: "Lobster", price: 13.4, categoryId: "main" },
  { id: "red-caviar", name: "Red caviar", price: 12.3, categoryId: "main" },
  // Add more menu items for other categories as needed
]

export const tables: Table[] = [
  { id: "t4-leslie", number: "T4", customerName: "Leslie K.", itemCount: 6, status: "completed" },
  { id: "t2-jacob", number: "T2", customerName: "Jacob J.", itemCount: 4, status: "in process" },
  { id: "t4-cameron", number: "T4", customerName: "Cameron W.", itemCount: 6, status: "in process" },
]


export const siteInfo = {
  title: "T-Sherles Bar Restaurant",
  description: ""
}
