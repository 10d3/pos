"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { MenuCard } from "@/components/pos/menu-card"
import { useCartStore } from "@/lib/stores/cart-store"
import { Search } from "lucide-react"

// Catégories de menu
const categories = [
  { id: "entrees", name: "Entrées", icon: "🥗" },
  { id: "plats", name: "Plats principaux", icon: "🍲" },
  { id: "desserts", name: "Desserts", icon: "🍰" },
  { id: "boissons", name: "Boissons", icon: "🥤" },
  { id: "vins", name: "Vins", icon: "🍷" },
  { id: "cocktails", name: "Cocktails", icon: "🍹" },
]

// Données de menu simulées
const menuItems = [
  // Entrées
  {
    id: "1",
    name: "Salade César",
    description: "Laitue romaine, croûtons, parmesan, sauce César",
    price: 8.5,
    category: "entrees",
    image: "/placeholder.svg?height=120&width=200",
  },
  {
    id: "2",
    name: "Soupe à l'oignon",
    description: "Soupe à l'oignon gratinée au fromage",
    price: 7.5,
    category: "entrees",
    image: "/placeholder.svg?height=120&width=200",
  },
  {
    id: "3",
    name: "Carpaccio de bœuf",
    description: "Fines tranches de bœuf, parmesan, huile d'olive",
    price: 12.0,
    category: "entrees",
    image: "/placeholder.svg?height=120&width=200",
  },

  // Plats principaux
  {
    id: "4",
    name: "Steak frites",
    description: "Entrecôte grillée, frites maison, sauce béarnaise",
    price: 22.0,
    category: "plats",
    image: "/placeholder.svg?height=120&width=200",
  },
  {
    id: "5",
    name: "Poulet rôti",
    description: "Poulet fermier rôti, légumes de saison",
    price: 18.5,
    category: "plats",
    image: "/placeholder.svg?height=120&width=200",
  },
  {
    id: "6",
    name: "Risotto aux champignons",
    description: "Risotto crémeux aux champignons sauvages",
    price: 16.0,
    category: "plats",
    image: "/placeholder.svg?height=120&width=200",
  },
  {
    id: "7",
    name: "Saumon grillé",
    description: "Filet de saumon grillé, purée de pommes de terre",
    price: 20.0,
    category: "plats",
    image: "/placeholder.svg?height=120&width=200",
  },

  // Desserts
  {
    id: "8",
    name: "Crème brûlée",
    description: "Crème vanillée caramélisée",
    price: 7.0,
    category: "desserts",
    image: "/placeholder.svg?height=120&width=200",
  },
  {
    id: "9",
    name: "Tarte Tatin",
    description: "Tarte aux pommes caramélisées, glace vanille",
    price: 8.0,
    category: "desserts",
    image: "/placeholder.svg?height=120&width=200",
  },

  // Boissons
  {
    id: "10",
    name: "Eau minérale",
    description: "Bouteille 75cl",
    price: 4.0,
    category: "boissons",
    image: "/placeholder.svg?height=120&width=200",
  },
  {
    id: "11",
    name: "Soda",
    description: "Coca-Cola, Sprite, Fanta",
    price: 3.5,
    category: "boissons",
    image: "/placeholder.svg?height=120&width=200",
  },

  // Vins
  {
    id: "12",
    name: "Vin rouge - Bordeaux",
    description: "Bouteille 75cl",
    price: 28.0,
    category: "vins",
    image: "/placeholder.svg?height=120&width=200",
  },
  {
    id: "13",
    name: "Vin blanc - Chablis",
    description: "Bouteille 75cl",
    price: 32.0,
    category: "vins",
    image: "/placeholder.svg?height=120&width=200",
  },

  // Cocktails
  {
    id: "14",
    name: "Mojito",
    description: "Rhum, menthe fraîche, citron vert, sucre de canne",
    price: 9.0,
    category: "cocktails",
    image: "/placeholder.svg?height=120&width=200",
  },
  {
    id: "15",
    name: "Margarita",
    description: "Tequila, triple sec, jus de citron vert",
    price: 10.0,
    category: "cocktails",
    image: "/placeholder.svg?height=120&width=200",
  },
]

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id)
  const [searchQuery, setSearchQuery] = useState("")
  const { addItem } = useCartStore()

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = item.category === activeCategory
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un article..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs
        defaultValue={categories[0].id}
        value={activeCategory}
        onValueChange={setActiveCategory}
        className="flex-1 flex flex-col"
      >
        <TabsList className="grid grid-flow-col auto-cols-max gap-2 px-4 py-2 overflow-x-auto justify-start">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="px-4 py-2">
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="flex-1 p-0 m-0">
            <ScrollArea className="h-[calc(100vh-180px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {filteredItems.map((item) => (
                  <MenuCard key={item.id} item={item} onAddToCart={() => addItem(item)} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

