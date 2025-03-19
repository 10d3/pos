import { useSyncStore } from '@/hooks/use-sync-store'
import { db } from '.'

export const syncService = {
  // Check if we're online by pinging our API
  async checkOnlineStatus() {
    try {
      const response = await fetch('/api/health-check', {
        method: 'HEAD',
        cache: 'no-cache',
      })
      return response.ok
    } catch (error) {
        console.log(error)
      return false
    }
  },

  // Start monitoring online/offline status
  startMonitoring() {
    const handleOnline = async () => {
      const isReachable = await this.checkOnlineStatus()
      if (isReachable) {
        useSyncStore.getState().setOnline(true)
        await this.syncPendingOrders()
      }
    }

    const handleOffline = () => {
      useSyncStore.getState().setOnline(false)
    }

    // Listen for browser online/offline events
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Initial check
    handleOnline()

    // Return cleanup function
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  },

  async syncPendingOrders() {
    try {
      const pendingOrders = await db.orders
        .where('syncStatus')
        .equals(0)
        .toArray()

      for (const order of pendingOrders) {
        // Try to sync with server
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(order),
        })

        if (response.ok) {
          await db.orders.update(order.id, { syncStatus: 1 })
        }
      }

      const remainingPending = await db.orders
        .where('syncStatus')
        .equals(0)
        .count()
      useSyncStore.getState().setPendingOrders(remainingPending)
    } catch (error) {
      console.error('Sync failed:', error)
    }
  }
}