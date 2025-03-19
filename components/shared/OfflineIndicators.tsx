import { useSyncStore } from "@/hooks/use-sync-store"

export function OfflineIndicator() {
  const { isOnline, pendingOrders } = useSyncStore()

  if (isOnline && !pendingOrders) return null

  return (
    <div className="fixed bottom-4 right-4 p-4 rounded-md shadow-lg">
      {!isOnline && (
        <div className="text-yellow-600 bg-yellow-50 p-2 rounded">
          You&apos;re offline - Orders will sync when connection returns
        </div>
      )}
      {pendingOrders > 0 && (
        <div className="text-blue-600 bg-blue-50 p-2 rounded mt-2">
          {pendingOrders} orders waiting to sync
        </div>
      )}
    </div>
  )
}