/* eslint-disable @typescript-eslint/no-explicit-any */
import Dexie, { Table } from "dexie";

export interface OfflineOrder {
  id: string;
  status: string;
  items: any[];
  total: number;
  tableNumber: string;
  customerId?: string;
  pointsUsed?: number;
  createdAt: Date;
  syncStatus: 0 | 1;  // Changed from boolean to number (0 = not synced, 1 = synced)
}

export class PosDatabase extends Dexie {
  orders!: Table<OfflineOrder>;
  menuItems!: Table<any>;
  customers!: Table<any>;

  constructor() {
    super("pos_offline_db");
    this.version(1).stores({
      orders: "++id, status, syncStatus, createdAt",  // Changed synced to syncStatus
      menuItems: "++id, name, category",
      customers: "++id, name, phone",
    });
  }

  // Helper methods
  async addOrder(order: Omit<OfflineOrder, 'syncStatus'>) {
    return await this.orders.add({
      ...order,
      syncStatus: 0
    });
  }

  async getUnsyncedOrders() {
    return await this.orders.where('syncStatus').equals(0).toArray();
  }

  async markAsSynced(orderId: string) {
    return await this.orders.update(orderId, { syncStatus: 1 });
  }
}

export const db = new PosDatabase();