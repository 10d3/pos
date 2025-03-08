/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
// import { useCartStore } from "@/lib/stores/cart-store"
// import { useOrderStore } from "@/lib/stores/order-store"
import { Utensils, ShoppingBag, Truck } from "lucide-react"
import { useOrderStore } from "@/lib/store/useOrderStore"
import { useCartStore } from "@/lib/store/cart-store"
import { OrderStatus } from "@/lib/types"

interface CheckoutModalProps {
  open: boolean
  onClose: () => void
  onComplete: (orderData: any) => void
}

type OrderType = "DINNER" | "TAKEAWAY" | "DELIVERY"

export function CheckoutModal({ open, onClose, onComplete }: CheckoutModalProps) {
  const { items, total, clearCart } = useCartStore()
  const { addOrder } = useOrderStore()
  const [orderType, setOrderType] = useState<OrderType>("DINNER")
  const [tableNumber, setTableNumber] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Validation
    if (orderType === "DINNER" && !tableNumber) {
      alert("Veuillez saisir un numéro de table")
      setIsSubmitting(false)
      return
    }

    if (orderType === "DELIVERY" && !deliveryAddress) {
      alert("Veuillez saisir une adresse de livraison")
      setIsSubmitting(false)
      return
    }

    // Préparer les données de la commande
    const orderData = {
      id: `ORD-${Date.now()}`,
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: total,
      tax: total * 0.1,
      total: total, // Total avec TVA
      orderType,
      tableNumber: orderType === "DINNER" ? tableNumber : null,
      deliveryAddress: orderType === "DELIVERY" ? deliveryAddress : null,
      phoneNumber: orderType === "DELIVERY" ? phoneNumber : null,
      notes: notes,
      staffId: "staff-123", // Normalement récupéré depuis le JWT
      date: new Date().toISOString(),
      status: "pending" as OrderStatus,
    }

    // Simuler l'envoi à l'API
    console.log("Envoi de la commande:", orderData)

    // Simuler un délai d'API
    setTimeout(() => {
      // Ajouter la commande à l'historique
      addOrder(orderData)

      // Réinitialiser le panier
      clearCart()

      // Fermer la modal et afficher la confirmation
      onComplete(orderData)
      setIsSubmitting(false)

      // Réinitialiser les champs
      setTableNumber("")
      setDeliveryAddress("")
      setPhoneNumber("")
      setNotes("")
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Finaliser la commande</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div>
            <Label>Type de commande</Label>
            <RadioGroup
              value={orderType}
              onValueChange={(value) => setOrderType(value as OrderType)}
              className="flex flex-col space-y-2 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="DINNER" id="dinner" />
                <Label htmlFor="dinner" className="flex items-center gap-2">
                  <Utensils className="h-4 w-4" />
                  Manger sur place (DINNER)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="TAKEAWAY" id="takeaway" />
                <Label htmlFor="takeaway" className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />À emporter (TAKEAWAY)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="DELIVERY" id="delivery" />
                <Label htmlFor="delivery" className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Livraison (DELIVERY)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {orderType === "DINNER" && (
            <div className="space-y-2">
              <Label htmlFor="tableNumber">Numéro de table</Label>
              <Input
                id="tableNumber"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Ex: 12"
              />
            </div>
          )}

          {orderType === "DELIVERY" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Adresse de livraison</Label>
                <Textarea
                  id="address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Adresse complète"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Ex: 06 12 34 56 78"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (allergies, demandes spéciales)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes pour la commande"
              rows={2}
            />
          </div>

          <div className="border rounded-lg p-4 space-y-2">
            <h3 className="font-medium">Récapitulatif de la commande</h3>

            <div className="space-y-1">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.quantity} × {item.name}
                  </span>
                  <span>{(item.price * item.quantity).toFixed(2)} HTG</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between text-sm">
                <span>Sous-total</span>
                <span>{total.toFixed(2)} HTG</span>
              </div>
              {/* <div className="flex justify-between text-sm">
                <span>TVA (10%)</span>
                <span>{(total * 0.1).toFixed(2)} €</span>
              </div> */}
              <div className="flex justify-between font-medium mt-1">
                <span>Total</span>
                <span>{(total).toFixed(2)} HTG</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Traitement..." : "Valider la commande"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

