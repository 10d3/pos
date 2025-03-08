export interface Category {
  id: string;
  name: string;
  icon: string;
  itemCount: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  categoryId: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Table {
  id: string;
  number: string;
  customerName: string;
  itemCount: number;
  status?: "in process" | "completed" | "pending";
}

export type OrderStatus = "pending" | "completed" | "cancelled";