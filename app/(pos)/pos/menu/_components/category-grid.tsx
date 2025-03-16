"use client"

import { cn } from "@/lib/utils"
// import type { Category } from "@/lib/types"

interface CategoryGridProps {
  categories: {
    id: string;
    name: string;
    icon: string;
    itemCount: number;
  }[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export function CategoryGrid({ categories, selectedCategory, onSelectCategory }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-4 gap-2 p-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={cn(
            "flex flex-col items-start p-4 rounded-lg transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            selectedCategory === category.id ? "bg-accent/50" : "bg-accent/10",
            category.id === "breakfast" && "bg-emerald-100/20",
            category.id === "soups" && "bg-purple-100/20",
            category.id === "pasta" && "bg-blue-100/20",
            category.id === "sushi" && "bg-blue-100/20",
            category.id === "main" && "bg-pink-100/20",
            category.id === "desserts" && "bg-muted/50",
            category.id === "drinks" && "bg-pink-100/20",
            category.id === "alcohol" && "bg-emerald-100/20",
          )}
        >
          <div className="text-2xl mb-2">{category.icon}</div>
          <div className="font-medium">{category.name}</div>
          <div className="text-sm text-muted-foreground">{category.itemCount} items</div>
        </button>
      ))}
    </div>
  )
}

