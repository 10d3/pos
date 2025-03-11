/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return amount.toFixed(2)
}

export function getOrderStatusColor(status: any): string {
  switch (status) {
    case "PENDING":
      return "#EAB308" // Yellow
    case "PREPARING":
      return "#3B82F6" // Blue
    case "READY":
      return "#22C55E" // Green
    case "DELIVERED":
      return "#8B5CF6" // Purple
    case "COMPLETED":
      return "#10B981" // Emerald
    case "CANCELLED":
      return "#EF4444" // Red
    default:
      return "#6B7280" // Gray
  }
}

export function getTimeElapsed(date: Date): string {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) {
    return "Just now"
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  } else {
    const hours = Math.floor(diffInMinutes / 60)
    const minutes = diffInMinutes % 60
    return `${hours}h ${minutes}m ago`
  }
}
