import { create } from "zustand"
import { persist } from "zustand/middleware"

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface Order {
  id: string
  items: OrderItem[]
  subtotal: number
  tax: number
  total: number
  orderType: "DINNER" | "TAKEAWAY" | "DELIVERY"
  tableNumber?: string | null
  deliveryAddress?: string | null
  phoneNumber?: string | null
  notes?: string
  staffId: string
  date: string
  status: "pending" | "completed" | "cancelled"
}

interface OrderStore {
  orders: Order[]
  addOrder: (order: Order) => void
  updateOrderStatus: (orderId: string, status: "pending" | "completed" | "cancelled") => void
  getOrderById: (orderId: string) => Order | undefined
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (order) => {
        set((state) => ({
          orders: [...state.orders, order],
        }))
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) => (order.id === orderId ? { ...order, status } : order)),
        }))
      },

      getOrderById: (orderId) => {
        return get().orders.find((order) => order.id === orderId)
      },
    }),
    {
      name: "order-storage",
    },
  ),
)

