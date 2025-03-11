"use client"
import type React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import {
  BarChart4,
  ChefHat,
  ClipboardList,
  Coffee,
  Home,
  LayoutGrid,
  Settings,
  Store,
  Users,
  Utensils,
} from "lucide-react"
import { RestaurantSwitcher } from "./restaurant-switcher"
import { NavShortcuts } from "./nav-shortcuts"
// import { TeamSwitcher } from "./team-switcher"

type User = {
  id: string
  name: string
  email: string
  avatar: string
  role: string
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: User
}

const data = {
  user: {
    id: "1",
    name: "John Doe",
    email: "john@restaurant.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Manager",
  },
  restaurants: [
    {
      name: "T-Sherles Bar Restaurant",
      logo: Store,
      location: "Rue Saint-Anne",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/pos",
      icon: Home,
      isActive: false,
    },
    {
      title: "Orders",
      url: "/pos/orders",
      icon: ClipboardList,
      isActive: true,
    },
    {
      title: "Menu",
      url: "/pos/menu",
      icon: Coffee,
      items: [
        {
          title: "All Items",
          url: "/pos/menu",
        },
        // {
        //   title: "Categories",
        //   url: "/pos/menu/categories",
        // },
        {
          title: "Specials",
          url: "/pos/menu/specials",
        },
      ],
    },
    {
      title: "Tables",
      url: "/pos/tables",
      icon: LayoutGrid,
    },
    {
      title: "Customers",
      url: "/pos/customers",
      icon: Users,
      items: [
        {
          title: "All Customers",
          url: "/pos/customers",
        },
        {
          title: "Loyalty Program",
          url: "/pos/customers/loyalty",
        },
      ],
    },
    {
      title: "Reports",
      url: "/pos/reports",
      icon: BarChart4,
      items: [
        {
          title: "Sales",
          url: "/pos/reports/sales",
        },
        {
          title: "Inventory",
          url: "/pos/reports/inventory",
        },
        {
          title: "Staff Performance",
          url: "/pos/reports/staff",
        },
      ],
    },
    {
      title: "Settings",
      url: "/pos/settings",
      icon: Settings,
      items: [
        {
          title: "General",
          url: "/pos/settings/general",
        },
        {
          title: "Printers",
          url: "/pos/settings/printers",
        },
        {
          title: "Staff",
          url: "/pos/settings/staff",
        },
        {
          title: "Payment Methods",
          url: "/pos/settings/payment",
        },
      ],
    },
  ],
  shortcuts: [
    {
      name: "New Order",
      url: "/pos/orders/new",
      icon: ClipboardList,
      color: "bg-primary/10 text-primary",
    },
    {
      name: "Kitchen View",
      url: "/pos/kitchen",
      icon: ChefHat,
      color: "bg-orange-500/10 text-orange-500",
    },
    {
      name: "Reservations",
      url: "/pos/reservations",
      icon: Utensils,
      color: "bg-blue-500/10 text-blue-500",
    },
  ],
}

export function AppSidebar({ user = data.user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b py-[10]">
        <RestaurantSwitcher restaurants={data.restaurants} />
        {/* <TeamSwitcher teams={data.restaurants} /> */}
      </SidebarHeader>
      <SidebarContent className="flex flex-col gap-6 py-4">
        <NavMain items={data.navMain} />
        <div className="px-4 py-2">
          <h3 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Quick Access</h3>
          <NavShortcuts shortcuts={data.shortcuts} />
        </div>
        <SidebarTrigger className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="border-t">
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

