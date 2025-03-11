import { Coffee, Cookie, Soup, UtensilsCrossed } from "lucide-react"

const dishes = [
  {
    name: "Roast chicken",
    orders: 120,
    icon: UtensilsCrossed,
  },
  {
    name: "Carbonara Paste",
    orders: 114,
    icon: Soup,
  },
  {
    name: "Fried egg",
    orders: 98,
    icon: Coffee,
  },
  {
    name: "Norwegian soup",
    orders: 82,
    icon: Cookie,
  },
]

export function TopDishes() {
  return (
    <div className="space-y-4">
      {dishes.map((dish) => (
        <div key={dish.name} className="flex items-center gap-4 rounded-lg bg-muted/40 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background">
            <dish.icon className="h-5 w-5" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{dish.name}</p>
            <p className="text-sm text-muted-foreground">Order: {dish.orders}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

