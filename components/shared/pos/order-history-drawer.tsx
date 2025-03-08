/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { useOrderStore } from "@/lib/store/useOrderStore"

interface OrderHistoryDrawerProps {
  open: boolean
  onClose: () => void
}

export function OrderHistoryDrawer({ open, onClose }: OrderHistoryDrawerProps) {
  const { orders } = useOrderStore()

  // Trier les commandes par date (plus récentes en premier)
  const sortedOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle>Historique des commandes</SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-140px)]">
          {sortedOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
              <p>Aucune commande dans l&apos;historique</p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {sortedOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">Commande #{order.id.slice(-4)}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(order.date), { addSuffix: true, locale: fr })}
                      </p>
                    </div>
                    <div className="px-2 py-1 text-xs rounded-full bg-muted">
                      {order.orderType === "DINNER" && "Sur place"}
                      {order.orderType === "TAKEAWAY" && "À emporter"}
                      {order.orderType === "DELIVERY" && "Livraison"}
                    </div>
                  </div>

                  <div className="space-y-1 mb-3">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.quantity} × {item.name}
                        </span>
                        <span>{(item.price * item.quantity).toFixed(2)} €</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-medium">{order.total.toFixed(2)} €</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <SheetFooter className="p-4 border-t">
          <Button onClick={onClose} className="w-full">
            Fermer
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

