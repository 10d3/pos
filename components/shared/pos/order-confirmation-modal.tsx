/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, Printer } from "lucide-react"

interface OrderConfirmationModalProps {
  open: boolean
  onClose: () => void
  orderData: any
}

export function OrderConfirmationModal({ open, onClose, orderData }: OrderConfirmationModalProps) {
  const [isPrinting, setIsPrinting] = useState(false)

  if (!orderData) return null

  const handlePrint = () => {
    setIsPrinting(true)

    // Simuler l'impression
    console.log("Impression de la commande:", orderData)

    // Simuler un délai d'impression
    setTimeout(() => {
      setIsPrinting(false)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Commande validée
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-1">Commande #{orderData.id.slice(-4)}</h2>
            <p className="text-muted-foreground">La commande a été enregistrée avec succès</p>
          </div>

          <div className="border rounded-lg p-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Type de commande:</span>
              <span>
                {orderData.orderType === "DINNER" && "Manger sur place"}
                {orderData.orderType === "TAKEAWAY" && "À emporter"}
                {orderData.orderType === "DELIVERY" && "Livraison"}
              </span>
            </div>

            {orderData.orderType === "DINNER" && orderData.tableNumber && (
              <div className="flex justify-between mb-2">
                <span className="font-medium">Numéro de table:</span>
                <span>{orderData.tableNumber}</span>
              </div>
            )}

            {orderData.orderType === "DELIVERY" && (
              <>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Adresse:</span>
                  <span className="text-right">{orderData.deliveryAddress}</span>
                </div>
                {orderData.phoneNumber && (
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Téléphone:</span>
                    <span>{orderData.phoneNumber}</span>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-between">
              <span className="font-medium">Total:</span>
              <span>{orderData.total.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={handlePrint} disabled={isPrinting}>
            <Printer className="h-4 w-4" />
            {isPrinting ? "Impression..." : "Imprimer le ticket"}
          </Button>
          <Button onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

