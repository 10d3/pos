"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store/cart-store"
import { CartItem } from "./cart-item"
import { ShoppingCart, Trash2, Receipt, Tag, ArrowRight } from "lucide-react"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

interface CartSectionProps {
  onCheckout: () => void
}

export function CartSection({ onCheckout }: CartSectionProps) {
  const { items, clearCart, total, isEmpty } = useCartStore()

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <Card className="flex flex-col h-full border-none shadow-none p-0 m-0 py-3">
      <CardHeader className="px-4 py-3 border-b flex-row items-center justify-between space-y-0">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Panier
            {!isEmpty() && (
              <Badge variant="secondary" className="ml-2">
                {itemCount} article{itemCount !== 1 ? "s" : ""}
              </Badge>
            )}
          </h2>
        </div>

        {!isEmpty() && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Vider
          </Button>
        )}
      </CardHeader>

      <ScrollArea className="flex-1 px-1">
        <AnimatePresence>
          {isEmpty() ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-[300px] text-muted-foreground"
            >
              <div className="relative">
                <ShoppingCart className="h-16 w-16 mb-2 opacity-20" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground/20">
                  0
                </div>
              </div>
              <p className="font-medium mt-4">Le panier est vide</p>
              <p className="text-sm mt-1">Ajoutez des articles depuis le menu</p>
              <div className="flex items-center text-xs mt-6 text-primary">
                <Tag className="h-3 w-3 mr-1" />
                <span>Sélectionnez des produits pour commencer</span>
                <ArrowRight className="h-3 w-3 ml-1" />
              </div>
            </motion.div>
          ) : (
            <div className="p-3 space-y-2">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CartItem item={item} />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </ScrollArea>

      <CardFooter className="flex-col p-0">
        <div className="w-full p-3 space-y-3 bg-muted/40 rounded-b-lg">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sous-total</span>
              <span>{total.toFixed(2)} HTG</span>
            </div>

            {/* Uncomment if needed
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">TVA (10%)</span>
              <span>{(total * 0.1).toFixed(2)} HTG</span>
            </div> */}

            <Separator className="my-1" />

            <div className="flex justify-between font-medium">
              <span className="flex items-center">
                <Receipt className="h-4 w-4 mr-1.5" />
                Total
              </span>
              <span className="text-lg">{total.toFixed(2)} HTG</span>
            </div>
          </div>

          <Button className="w-full mt-2" size="lg" onClick={onCheckout} disabled={isEmpty()}>
            {isEmpty() ? "Panier vide" : "Commander"}
            {!isEmpty() && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
