import { Suspense } from "react"
import { Search } from "lucide-react"

import { OrdersHeader } from "./_components/orders-header"
import { OrdersGrid } from "./_components/orders-grid"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

export default function OrdersPage() {
  return (
    <div className="flex flex-col h-screen bg-background overflow-auto">
      <div className="p-4 border-b">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search" className="w-full pl-8 bg-muted/40" />
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="p-4">
          <OrdersHeader />
          <Suspense fallback={<OrdersGridSkeleton />}>
            <OrdersGrid />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function OrdersGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-64 rounded-lg" />
      ))}
    </div>
  )
}

