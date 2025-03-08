"use client"

import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useOrderStore } from "@/lib/store/useOrderStore"

interface OrderSummaryProps {
  onUpdateQuantity: (id: string, quantity: number) => void
}

export function OrderSummary({ onUpdateQuantity }: OrderSummaryProps) {
  const { orders, total: storeTotal, clearOrders } = useOrderStore()

  const subtotal = storeTotal
  const taxRate = 0.1
  const tax = subtotal * taxRate
  const total = subtotal + tax

  return (
    <div className="w-96 bg-muted/5 border-l flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Table 5</h2>
        <p className="text-sm text-muted-foreground">Leslie K.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {orders.map((item, index) => (
          <div key={item.id} className="mb-4 bg-muted/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm">
                  {index + 1}
                </div>
                <span className="font-medium">{item.name}</span>
              </div>
              <span>x{item.quantity}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-primary">${(item.price * item.quantity).toFixed(2)}</div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 rounded-md"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-4 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 rounded-md"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Tax {(taxRate * 100).toFixed(0)}%</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="border-t my-4"></div>
        <div className="flex justify-between mb-6">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-lg font-semibold">${total.toFixed(2)}</span>
        </div>

        <div className="mb-4">
          <h3 className="text-sm text-muted-foreground mb-2">Payment Method</h3>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" className="flex flex-col h-16 justify-center">
              <span className="text-xl">$</span>
              <span className="text-xs">Cash</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-16 justify-center">
              <span className="text-xl">💳</span>
              <span className="text-xs">Debit Card</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-16 justify-center">
              <span className="text-xl">📱</span>
              <span className="text-xs">E-Wallet</span>
            </Button>
          </div>
        </div>

        <Button className="w-full" size="lg" onClick={clearOrders}>
          Place Order
        </Button>
      </div>
    </div>
  )
}

