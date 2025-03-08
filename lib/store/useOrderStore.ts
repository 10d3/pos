import { create } from "zustand";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderState {
  orders: OrderItem[];
  total: number;
  addOrder: (item: OrderItem) => void;
  removeOrder: (id: string) => void;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  total: 0,

  addOrder: (item) => {
    set((state) => {
      const existingOrder = state.orders.find((order) => order.id === item.id);

      if (existingOrder) {
        // Augmenter la quantité si l'article existe déjà
        return {
          orders: state.orders.map((order) =>
            order.id === item.id
              ? { ...order, quantity: order.quantity + item.quantity }
              : order
          ),
          total: state.total + item.price * item.quantity,
        };
      }

      // Ajouter un nouvel article
      return {
        orders: [...state.orders, item],
        total: state.total + item.price * item.quantity,
      };
    });
  },

  removeOrder: (id) => {
    set((state) => {
      const orderToRemove = state.orders.find((order) => order.id === id);
      if (!orderToRemove) return state;

      return {
        orders: state.orders.filter((order) => order.id !== id),
        total: state.total - orderToRemove.price * orderToRemove.quantity,
      };
    });
  },

  clearOrders: () => set({ orders: [], total: 0 }),
}));
