/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useOrderStore } from "@/lib/store/useOrderStore"
import { useCartStore } from "@/lib/store/cart-store"
import type { OrderStatus } from "@/lib/types"
import { Utensils, ShoppingBag, Truck, Search, Coins, BadgePercent, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface CheckoutModalProps {
  open: boolean
  onClose: () => void
  onComplete: (orderData: any) => void
  user: User
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
  const [lookupLoading, setLookupLoading] = useState(false)

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
      setLookupLoading(true)
      const response = await fetch(`/api/customers?phone=${phone}`)
      const data = await response.json()
      setCustomer(data)
      setPointsToRedeem(0)
    } catch (error) {
      console.error("Customer lookup failed:", error)
    } finally {
      setLookupLoading(false)
    }
  }

  const handleRedeemPoints = () => {
    if (!customer || pointsToRedeem <= 0) return
    const discount = pointsToRedeem / REDEEM_RATE
    const newTotal = Math.max(initialTotal - discount, 0)
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
      phone: orderType === "DELIVERY" || customer ? phone : null,
      notes: notes,
      staffId: user.id,
      date: new Date().toISOString(),
      status: "PENDING" as OrderStatus,
      customerId: customer?.id,
      pointsUsed: pointsToRedeem,
      pointsEarned: Math.floor(total * POINTS_PER_DOLLAR),
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
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

  const getOrderTypeIcon = (type: OrderType) => {
    switch (type) {
      case "DINNER":
        return <Utensils className="h-5 w-5" />
      case "TAKEAWAY":
        return <ShoppingBag className="h-5 w-5" />
      case "DELIVERY":
        return <Truck className="h-5 w-5" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {getOrderTypeIcon(orderType)}
            Finalize Order
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Order Details</TabsTrigger>
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 py-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Order Type</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["DINNER", "TAKEAWAY", "DELIVERY"] as OrderType[]).map((type) => (
                  <Button
                    key={type}
                    variant={orderType === type ? "default" : "outline"}
                    className="flex-col h-auto py-3 px-2 gap-2"
                    onClick={() => setOrderType(type)}
                  >
                    {getOrderTypeIcon(type)}
                    <span>{type === "DINNER" ? "Dine In" : type.charAt(0) + type.slice(1).toLowerCase()}</span>
                  </Button>
                ))}
              </div>
            </div>

            {orderType === "DINNER" && (
              <div className="space-y-2">
                <Label htmlFor="tableNumber" className="text-sm font-medium">
                  Table Number
                </Label>
                <Input
                  id="tableNumber"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="e.g., 12"
                  className="focus-visible:ring-primary"
                />
              </div>
            )}

            {orderType === "DELIVERY" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Delivery Address
                  </Label>
                  <Textarea
                    id="address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Full address"
                    rows={3}
                    className="focus-visible:ring-primary resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g., 555-123-4567"
                    className="focus-visible:ring-primary"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Special Instructions
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Allergies, special requests..."
                rows={2}
                className="focus-visible:ring-primary resize-none"
              />
            </div>
          </TabsContent>

          <TabsContent value="customer" className="space-y-4 py-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Customer Loyalty</Label>
                {customer && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Coins className="h-3 w-3" />
                    {customer.points} points
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="pr-10 focus-visible:ring-primary"
                  />
                </div>
                <Button onClick={handleLookupCustomer} disabled={!phone || lookupLoading} className="gap-1">
                  {lookupLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Lookup
                </Button>
              </div>

              {customer && (
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{customer.name}</h4>
                        <p className="text-sm text-muted-foreground">{phone}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium flex items-center gap-1">
                          <BadgePercent className="h-4 w-4" />
                          Redeem Points
                        </Label>
                        <p className="text-xs text-muted-foreground">{REDEEM_RATE} points = 1 HTG</p>
                      </div>

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
                          className="focus-visible:ring-primary"
                        />
                        <Button onClick={handleRedeemPoints} disabled={pointsToRedeem <= 0} variant="secondary">
                          Apply
                        </Button>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span>Max redeemable:</span>
                        <span>
                          {maxRedeemablePoints} points ({(maxRedeemablePoints / REDEEM_RATE).toFixed(2)} HTG)
                        </span>
                      </div>

                      {pointsToRedeem > 0 && (
                        <div className="flex justify-between text-sm font-medium">
                          <span>Discount applied:</span>
                          <span className="text-green-600">-{(pointsToRedeem / REDEEM_RATE).toFixed(2)} HTG</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4 py-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <h3 className="font-medium text-lg flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Order Items
                  </h3>
                  <div className="mt-3 space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-1 border-b last:border-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="h-6 w-6 flex items-center justify-center p-0">
                            {item.quantity}
                          </Badge>
                          <span>{item.name}</span>
                        </div>
                        <span className="font-medium">{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{initialTotal.toFixed(2)}</span>
                  </div>

                  {pointsToRedeem > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Points Discount</span>
                      <span>-{(pointsToRedeem / REDEEM_RATE).toFixed(2)}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{total.toFixed(2)}</span>
                  </div>

                  {customer && (
                    <div className="flex justify-between text-sm text-primary">
                      <span>Points Earned</span>
                      <span>+{Math.floor(total * POINTS_PER_DOLLAR)}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm">
                      <span className="font-medium">Order Type:</span>
                      <span className="ml-1">
                        {orderType === "DINNER" ? "Dine In" : orderType.charAt(0) + orderType.slice(1).toLowerCase()}
                      </span>
                    </div>

                    {orderType === "DINNER" && tableNumber && (
                      <div className="text-sm">
                        <span className="font-medium">Table:</span>
                        <span className="ml-1">{tableNumber}</span>
                      </div>
                    )}

                    {orderType === "DELIVERY" && deliveryAddress && (
                      <div className="text-sm col-span-2">
                        <span className="font-medium">Delivery to:</span>
                        <span className="ml-1">{deliveryAddress}</span>
                      </div>
                    )}

                    {notes && (
                      <div className="text-sm col-span-2">
                        <span className="font-medium">Notes:</span>
                        <span className="ml-1">{notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full sm:w-auto gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Order"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

