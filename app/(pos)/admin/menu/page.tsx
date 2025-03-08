"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { CategoryGrid } from "./_components/category-grid"
import { MenuItems } from "./_components/menu-items"
import { OrderSummary } from "./_components/order-summary"
import { TableStatus } from "./_components/table-status"
import { Input } from "@/components/ui/input"
import { categories, menuItems, tables } from "@/lib/data"
import type { MenuItem } from "@/lib/types"
import { useOrderStore } from "@/lib/store/useOrderStore"

export default function RestaurantPOS() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id)
  const { orders, addOrder, removeOrder } = useOrderStore()

  const filteredItems = menuItems.filter((item) => item.categoryId === selectedCategory)

  const handleAddItem = (item: MenuItem) => {
    addOrder({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    const item = menuItems.find((item) => item.id === id)
    if (!item) return

    if (quantity <= 0) {
      removeOrder(id)
    } else {
      const currentQuantity = orders.find((order) => order.id === id)?.quantity || 0
      const quantityDiff = quantity - currentQuantity

      if (quantityDiff > 0) {
        addOrder({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: quantityDiff,
        })
      } else {
        // For decreasing, we'll remove and add with new quantity
        removeOrder(id)
        if (quantity > 0) {
          addOrder({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: quantity,
          })
        }
      }
    }
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Search bar */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9 bg-muted/50 border-0" placeholder="Search" />
          </div>
        </div>

        {/* Categories */}
        <CategoryGrid
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Menu items */}
        <MenuItems
          items={filteredItems}
          orderItems={orders}
          onAddItem={handleAddItem}
          onUpdateQuantity={updateQuantity}
        />

        {/* Table status */}
        <div className="mt-auto border-t">
          <TableStatus tables={tables} />
        </div>
      </div>

      {/* Order summary sidebar */}
      <OrderSummary onUpdateQuantity={updateQuantity} />
    </div>
  )
}

