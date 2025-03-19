"use client";
import type React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
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
} from "lucide-react";
import { RestaurantSwitcher } from "./restaurant-switcher";
import { NavShortcuts } from "./nav-shortcuts";
import { InstallPWA } from "../shared/InstallPWA";
// import { TeamSwitcher } from "./team-switcher"

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: User;
};

const data = {
  user: {
    id: "1",
    name: "John Doe",
    email: "john@restaurant.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Gérant",
  },
  restaurants: [
    {
      name: "Bar Restaurant T-Sherles",
      logo: Store,
      location: "Rue Saint-Anne",
    },
  ],
  navMain: [
    {
      title: "Tableau de bord",
      url: "/pos",
      icon: Home,
      isActive: false,
    },
    {
      title: "Commandes",
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
          title: "Tous les articles",
          url: "/pos/menu",
        },
        // {
        //   title: "Catégories",
        //   url: "/pos/menu/categories",
        // },
        {
          title: "Spécialités",
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
      title: "Clients",
      url: "/pos/customers",
      icon: Users,
      items: [
        {
          title: "Tous les clients",
          url: "/pos/customers",
        },
        {
          title: "Programme de fidélité",
          url: "/pos/customers/loyalty",
        },
      ],
    },
    {
      title: "Rapports",
      url: "/pos/reports",
      icon: BarChart4,
      items: [
        {
          title: "Ventes",
          url: "/pos/reports/sales",
        },
        {
          title: "Inventaire",
          url: "/pos/reports/inventory",
        },
        {
          title: "Performance du personnel",
          url: "/pos/reports/staff",
        },
      ],
    },
    {
      title: "Paramètres",
      url: "/pos/settings",
      icon: Settings,
      items: [
        {
          title: "Général",
          url: "/pos/settings/general",
        },
        {
          title: "Imprimantes",
          url: "/pos/settings/printers",
        },
        {
          title: "Personnel",
          url: "/pos/settings/staff",
        },
        {
          title: "Modes de paiement",
          url: "/pos/settings/payment",
        },
      ],
    },
  ],
  shortcuts: [
    {
      name: "Nouvelle commande",
      url: "/pos/menu",
      icon: ClipboardList,
      color: "bg-primary/10 text-primary",
    },
    {
      name: "Vue cuisine",
      url: "/pos/kitchen",
      icon: ChefHat,
      color: "bg-orange-500/10 text-orange-500",
    },
    {
      name: "Réservations",
      url: "/pos/reservations",
      icon: Utensils,
      color: "bg-blue-500/10 text-blue-500",
    },
  ],
};

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
          <h3 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
            Quick Access
          </h3>
          <NavShortcuts shortcuts={data.shortcuts} />
        </div>
        <SidebarTrigger className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="border-t">
        <InstallPWA />
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
