import { Order } from "@prisma/client";

export type OrderWithItems = Order & {
  orderItems: (OrderItem & {
    menuItem: MenuItem
  })[]
}

export enum OrderStatusEnum {
  PENDING = "PENDING",
  PREPARING = "PREPARING",
  READY = "READY",
  DELIVERED = "DELIVERED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum OrderTypeEnum {
  DINE_IN = "DINE_IN",
  TAKEOUT = "TAKEOUT",
  DELIVERY = "DELIVERY",
}


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
  description: string
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
  status?: OrderStatus;
}

export type OrderStatus =  "PENDING" | "COMPLETED" | "CANCELLED" | "PREPARING" | "READY" | "DELIVERED";