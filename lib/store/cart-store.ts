import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface CartStore {
  items: CartItem[]
  total: number
  addItem: (item: { id: string; name: string; price: number }) => void
  updateQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
  isEmpty: () => boolean
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addItem: (item) => {
        const currentItems = get().items
        const existingItem = currentItems.find((i) => i.id === item.id)

        if (existingItem) {
          // Mettre à jour la quantité si l'article existe déjà
          set({
            items: currentItems.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)),
            total: get().total + item.price,
          })
        } else {
          // Ajouter un nouvel article
          set({
            items: [...currentItems, { ...item, quantity: 1 }],
            total: get().total + item.price,
          })
        }
      },

      updateQuantity: (id, quantity) => {
        const currentItems = get().items
        const item = currentItems.find((i) => i.id === id)

        if (!item) return

        if (quantity <= 0) {
          // Supprimer l'article si la quantité est 0 ou moins
          set({
            items: currentItems.filter((i) => i.id !== id),
            total: get().total - item.price * item.quantity,
          })
        } else {
          // Mettre à jour la quantité
          const quantityDiff = quantity - item.quantity
          set({
            items: currentItems.map((i) => (i.id === id ? { ...i, quantity } : i)),
            total: get().total + item.price * quantityDiff,
          })
        }
      },

      removeItem: (id) => {
        const currentItems = get().items
        const item = currentItems.find((i) => i.id === id)

        if (!item) return

        set({
          items: currentItems.filter((i) => i.id !== id),
          total: get().total - item.price * item.quantity,
        })
      },

      clearCart: () => {
        set({
          items: [],
          total: 0,
        })
      },

      isEmpty: () => {
        return get().items.length === 0
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)

