import { DollarSign, Receipt, Soup, Wallet } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string
  icon: "dollar" | "receipt" | "tip" | "dish"
  className?: string
}

const icons = {
  dollar: DollarSign,
  receipt: Receipt,
  tip: Wallet,
  dish: Soup,
}

export function StatsCard({ title, value, icon, className }: StatsCardProps) {
  const Icon = icons[icon]

  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

