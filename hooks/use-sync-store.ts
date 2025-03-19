import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SyncState {
  isOnline: boolean;
  pendingOrders: number;
  setOnline: (status: boolean) => void;
  setPendingOrders: (count: number) => void;
}

export const useSyncStore = create<SyncState>()(
  persist(
    (set) => ({
      isOnline: true,
      pendingOrders: 0,
      setOnline: (status) => set({ isOnline: status }),
      setPendingOrders: (count) => set({ pendingOrders: count }),
    }),
    {
      name: "sync-storage",
    }
  )
);
