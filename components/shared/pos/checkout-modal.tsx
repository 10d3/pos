/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useOrderStore } from "@/lib/store/useOrderStore"
import { useCartStore } from "@/lib/store/cart-store"
import { OrderStatus } from "@/lib/types"
import { Utensils, ShoppingBag, Truck } from "lucide-react"

interface user{
  id: string,
  name : string,
  email: string,
  role: string
}
interface CheckoutModalProps {
  open: boolean
  onClose: () => void
  onComplete: (orderData: any) => void
  user: user
}

type OrderType = "DINNER" | "TAKEAWAY" | "DELIVERY"

export function CheckoutModal({ open, onClose, onComplete, user }: CheckoutModalProps) {
  const { items, total: initialTotal, clearCart } = useCartStore()
  const { addOrder } = useOrderStore()
  const [orderType, setOrderType] = useState<OrderType>("DINNER")
  const [tableNumber, setTableNumber] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customer, setCustomer] = useState<any>(null)
  const [pointsToRedeem, setPointsToRedeem] = useState(0)
  const [maxRedeemablePoints, setMaxRedeemablePoints] = useState(0)
  const [total, setTotal] = useState(initialTotal)

  const POINTS_PER_DOLLAR = 1
  const REDEEM_RATE = 100 // 100 points = $1

  useEffect(() => {
    setTotal(initialTotal)
  }, [initialTotal])

  useEffect(() => {
    if (customer && total) {
      const maxFromPoints = customer.points
      const maxFromTotal = Math.floor(total * REDEEM_RATE)
      setMaxRedeemablePoints(Math.min(maxFromPoints, maxFromTotal))
    }
  }, [customer, total])

  const handleLookupCustomer = async () => {
    if (!phone) return
    try {
      const response = await fetch(`/api/customers?phone=${phone}`)
      const data = await response.json()
      setCustomer(data)
      setPointsToRedeem(0)
    } catch (error) {
      console.error("Customer lookup failed:", error)
    }
  }

  const handleRedeemPoints = () => {
    if (!customer || pointsToRedeem <= 0) return
    const discount = pointsToRedeem / REDEEM_RATE
    const newTotal = Math.max(total - discount, 0)
    setTotal(newTotal)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    if (orderType === "DINNER" && !tableNumber) {
      alert("Please enter table number")
      setIsSubmitting(false)
      return
    }

    if (orderType === "DELIVERY" && !deliveryAddress) {
      alert("Please enter delivery address")
      setIsSubmitting(false)
      return
    }

    const orderData = {
      id: `ORD-${Date.now()}`,
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: initialTotal,
      total: total,
      orderType,
      tableNumber: orderType === "DINNER" ? tableNumber : null,
      deliveryAddress: orderType === "DELIVERY" ? deliveryAddress : null,
      phone: orderType === "DELIVERY" ? phone : null,
      notes: notes,
      staffId: user.id,
      date: new Date().toISOString(),
      status: "PENDING" as OrderStatus,
      customerId: customer?.id,
      pointsUsed: pointsToRedeem,
      pointsEarned: Math.floor(total * POINTS_PER_DOLLAR)
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      })

      if (!res.ok) throw new Error("Order failed")

      addOrder(orderData)
      clearCart()
      onComplete(orderData)
      setIsSubmitting(false)
      resetForm()
    } catch (error) {
      console.error("Order error:", error)
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setTableNumber("")
    setDeliveryAddress("")
    setPhone("")
    setNotes("")
    setCustomer(null)
    setPointsToRedeem(0)
    setTotal(initialTotal)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] overflow-auto">
        <DialogHeader>
          <DialogTitle>Finalize Order</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div>
            <Label>Order Type</Label>
            <RadioGroup
              value={orderType}
              onValueChange={(value) => setOrderType(value as OrderType)}
              className="flex flex-col space-y-2 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="DINNER" id="dinner" />
                <Label htmlFor="dinner" className="flex items-center gap-2">
                  <Utensils className="h-4 w-4" />
                  Dine In
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="TAKEAWAY" id="takeaway" />
                <Label htmlFor="takeaway" className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Takeaway
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="DELIVERY" id="delivery" />
                <Label htmlFor="delivery" className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Delivery
                </Label>
              </div>
            </RadioGroup>
          </div>

          {orderType === "DINNER" && (
            <div className="space-y-2">
              <Label htmlFor="tableNumber">Table Number</Label>
              <Input
                id="tableNumber"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="e.g., 12"
              />
            </div>
          )}

          {orderType === "DELIVERY" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address</Label>
                <Textarea
                  id="address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Full address"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g., 555-123-4567"
                />
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Customer Loyalty</Label>
              <div className="flex gap-2">
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  // disabled={orderType !== "DELIVERY"}
                />
                <Button
                  onClick={handleLookupCustomer}
                  disabled={!phone}
                >
                  Lookup
                </Button>
              </div>
              {customer && (
                <div className="text-sm p-2 bg-muted rounded-md">
                  <p>{customer.name} - {customer.points} points available</p>
                </div>
              )}
            </div>

            {customer && (
              <div className="space-y-2">
                <Label>Redeem Points</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={pointsToRedeem}
                    onChange={(e) => {
                      const value = Math.min(Number(e.target.value), maxRedeemablePoints)
                      setPointsToRedeem(value < 0 ? 0 : value)
                    }}
                    min="0"
                    max={maxRedeemablePoints}
                  />
                  <Button
                    onClick={handleRedeemPoints}
                    disabled={pointsToRedeem <= 0}
                  >
                    Apply Points
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Max redeemable: {maxRedeemablePoints} points ({(maxRedeemablePoints / REDEEM_RATE).toFixed(2)} HTG)
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Special Instructions</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Allergies, special requests..."
              rows={2}
            />
          </div>

          <div className="border rounded-lg p-4 space-y-2">
            <h3 className="font-medium">Order Summary</h3>
            <div className="space-y-1">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.quantity} × {item.name}</span>
                  <span>{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-2 mt-2 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{initialTotal.toFixed(2)}</span>
              </div>
              {pointsToRedeem > 0 && (
                <div className="flex justify-between text-destructive">
                  <span>Points Discount</span>
                  <span>-{(pointsToRedeem / REDEEM_RATE).toFixed(2)}</span>
                </div>
              )}
              {customer && (
                <div className="flex justify-between text-primary">
                  <span>Points Earned</span>
                  <span>+{Math.floor(total * POINTS_PER_DOLLAR)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Confirm Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}