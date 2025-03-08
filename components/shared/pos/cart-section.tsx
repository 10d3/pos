"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
// import { CartItem } from "@/components/pos/cart-item"
// import { useCartStore } from "@/lib/stores/cart-store"
import { ShoppingCart, Trash2 } from "lucide-react"
import { useCartStore } from "@/lib/store/cart-store"
import { CartItem } from "./cart-item"

interface CartSectionProps {
  onCheckout: () => void
}

export function CartSection({ onCheckout }: CartSectionProps) {
  const { items, clearCart, total, isEmpty } = useCartStore()

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Panier
          </h2>
          <p className="text-sm text-muted-foreground">
            {items.length} article{items.length !== 1 ? "s" : ""}
          </p>
        </div>

        {!isEmpty() && (
          <Button variant="outline" size="sm" onClick={clearCart} className="flex items-center gap-1 text-destructive">
            <Trash2 className="h-4 w-4" />
            Vider
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        {isEmpty() ? (
          <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mb-2 opacity-20" />
            <p>Le panier est vide</p>
            <p className="text-sm">Ajoutez des articles depuis le menu</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex justify-between mb-2">
          <span>Sous-total</span>
          <span>{total.toFixed(2)} HTG</span>
        </div>
        {/* <div className="flex justify-between mb-2">
          <span>TVA (10%)</span>
          <span>{(total * 0.1).toFixed(2)} €</span>
        </div> */}
        <div className="flex justify-between mb-4 font-semibold text-lg">
          <span>Total</span>
          <span>{(total).toFixed(2)} HTG</span>
        </div>

        <Button className="w-full" size="lg" onClick={onCheckout} disabled={isEmpty()}>
          Commander
        </Button>
      </div>
    </div>
  )
}

