"use client"

import { Minus, Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store/cart-store"
// import { useCartStore } from "@/lib/stores/cart-store"

interface CartItemProps {
  item: {
    id: string
    name: string
    price: number
    quantity: number
  }
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span className="font-medium">{item.name}</span>
          {/* <span className="font-medium">{(item.price * item.quantity).toFixed(2)} €</span> */}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <span>
            {item.price.toFixed(2)} HTG × {item.quantity}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 ml-4">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-6 text-center">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
        <Button variant="outline" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeItem(item.id)}>
          <Trash className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

