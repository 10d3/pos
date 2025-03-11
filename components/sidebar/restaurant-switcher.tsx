"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"

type Restaurant = {
  name: string
  logo: LucideIcon
  location: string
}

interface RestaurantSwitcherProps {
  restaurants: Restaurant[]
}

export function RestaurantSwitcher({ restaurants }: RestaurantSwitcherProps) {
  const { isMobile } = useSidebar()
  const [activeRestaurant, setActiveRestaurant] = React.useState(restaurants[0])

  if (!activeRestaurant) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <activeRestaurant.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{activeRestaurant.name}</span>
                <span className="truncate text-xs">{activeRestaurant.location}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">Restaurants</DropdownMenuLabel>
            {restaurants.map((restaurant, index) => (
              <DropdownMenuItem
                key={restaurant.name}
                onClick={() => setActiveRestaurant(restaurant)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <restaurant.logo className="size-4 shrink-0" />
                </div>
                <div className="flex flex-col">
                  <span>{restaurant.name}</span>
                  <span className="text-xs text-muted-foreground">{restaurant.location}</span>
                </div>
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add restaurant</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

