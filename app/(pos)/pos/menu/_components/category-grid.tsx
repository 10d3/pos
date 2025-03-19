"use client"

import { cn } from "@/lib/utils"

interface CategoryGridProps {
  categories: {
    id: string
    name: string
    icon: string
    itemCount: number
  }[]
  selectedCategory: string
  onSelectCategory: (id: string) => void
}

export function CategoryGrid({ categories, selectedCategory, onSelectCategory }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-3">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg transition-all duration-200 shadow-sm",
            "hover:bg-accent hover:text-accent-foreground hover:shadow",
            selectedCategory === category.id
              ? "bg-accent/80 text-accent-foreground ring-1 ring-primary/20 shadow-sm"
              : "bg-background/80 border border-border/40",
            category.id === "breakfast" && "hover:bg-emerald-100/40 hover:text-emerald-900",
            category.id === "soups" && "hover:bg-purple-100/40 hover:text-purple-900",
            category.id === "pasta" && "hover:bg-blue-100/40 hover:text-blue-900",
            category.id === "sushi" && "hover:bg-cyan-100/40 hover:text-cyan-900",
            category.id === "main" && "hover:bg-pink-100/40 hover:text-pink-900",
            category.id === "desserts" && "hover:bg-amber-100/40 hover:text-amber-900",
            category.id === "drinks" && "hover:bg-indigo-100/40 hover:text-indigo-900",
            category.id === "alcohol" && "hover:bg-red-100/40 hover:text-red-900",
          )}
        >
          <span className="text-xl bg-muted/30 p-2 rounded-full">{category.icon}</span>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium leading-tight">{category.name}</span>
            <span className="text-xs text-muted-foreground leading-tight">{category.itemCount} items</span>
          </div>
        </button>
      ))}
    </div>
  )
}
