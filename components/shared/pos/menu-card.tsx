"use client"

import Image from "next/image"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useCartStore } from "@/lib/stores/cart-store"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
}

interface MenuCardProps {
  item: MenuItem
  onAddToCart: () => void
}

export function MenuCard({ item, onAddToCart }: MenuCardProps) {
  const { items } = useCartStore()
  const itemInCart = items.find((cartItem) => cartItem.id === item.id)
  const quantity = itemInCart ? itemInCart.quantity : 0

  return (
    <Card className="overflow-hidden">
      <div className="relative h-[120px] w-full">
        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{item.name}</h3>
          <span className="font-semibold text-primary">{item.price.toFixed(2)} €</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        {quantity > 0 && <span className="text-sm font-medium">{quantity} dans le panier</span>}
        <Button size="sm" onClick={onAddToCart} className="ml-auto">
          <Plus className="h-4 w-4 mr-1" />
          Ajouter
        </Button>
      </CardFooter>
    </Card>
  )
}

