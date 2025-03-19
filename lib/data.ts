// import type { Category } from "@/lib/types"

export const categories: Category[] = [
  { id: "entrees", name: "Entrées", icon: "🥗" },
  { id: "plats_principaux", name: "Plats Principaux", icon: "🍽️" },
  { id: "pizzas", name: "Pizzas", icon: "🍕" },
  { id: "burgers", name: "Burgers", icon: "🍔" },
  { id: "salades", name: "Salades", icon: "🥬" },
  { id: "pates", name: "Pâtes", icon: "🍝" },
  { id: "grillades", name: "Grillades", icon: "🥩" },
  { id: "fruits_de_mer", name: "Fruits de Mer", icon: "🦐" },
  { id: "soupes", name: "Soupes", icon: "🍜" },
  { id: "sandwiches", name: "Sandwiches", icon: "🥪" },
  { id: "accompagnements", name: "Accompagnements", icon: "🥨" },
  { id: "vegan", name: "Vegan", icon: "🌱" },
  { id: "desserts", name: "Desserts", icon: "🍰" },
  { id: "boissons", name: "Boissons", icon: "🥤" },
  { id: "vins_alcools", name: "Vins & Alcools", icon: "🍷" },
  { id: "menu_enfant", name: "Menu Enfant", icon: "🧸" },
  { id: "petit_dejeuner", name: "Petit Déjeuner", icon: "🥐" },
  { id: "specialites", name: "Spécialités", icon: "⭐" }
];

// Type definition
export interface Category {
  id: string;
  name: string;
  icon: string;
}

// // export const menuItems: MenuItem[] = [
// //   { id: "fish-and-chips", name: "Fish and chips", price: 7.5, categoryId: "main" },
// //   { id: "roast-chicken", name: "Roast chicken", price: 12.75, categoryId: "main" },
// //   { id: "fillet-steak", name: "Fillet steak", price: 11.6, categoryId: "main" },
// //   { id: "beefsteak", name: "Beefsteak", price: 10.2, categoryId: "main" },
// //   { id: "roast-beef", name: "Roast beef", price: 10.5, categoryId: "main" },
// //   { id: "buffalo-wings", name: "Buffalo wings", price: 8.85, categoryId: "main" },
// //   { id: "lobster", name: "Lobster", price: 13.4, categoryId: "main" },
// //   { id: "red-caviar", name: "Red caviar", price: 12.3, categoryId: "main" },
// //   // Add more menu items for other categories as needed
// // ]

// export const tables: Table[] = [
//   { id: "t4-leslie", number: "T4", customerName: "Leslie K.", itemCount: 6, status: "completed" },
//   { id: "t2-jacob", number: "T2", customerName: "Jacob J.", itemCount: 4, status: "in process" },
//   { id: "t4-cameron", number: "T4", customerName: "Cameron W.", itemCount: 6, status: "in process" },
// ]

export const siteInfo = {
  title: "T-Sherles Bar Restaurant",
  description: "",
};
