"use client"

import * as React from "react"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

interface NavMainProps {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
      isActive?: boolean
    }[]
  }[]
}

export function NavMain({ items }: NavMainProps) {
  const [openItems, setOpenItems] = React.useState<string[]>([])

  return (
    <div className="grid gap-1 px-2">
      {items.map((item, index) =>
        !item.items || item.items.length === 0 ? (
          <Button
            key={index}
            variant={item.isActive ? "secondary" : "ghost"}
            className={cn("flex h-10 w-full justify-start gap-3", item.isActive && "bg-secondary")}
            asChild
          >
            <Link href={item.url}>
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          </Button>
        ) : (
          <Accordion key={index} type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-1">
            <AccordionItem value={item.title} className="border-none">
              <AccordionTrigger
                className={cn(
                  "flex h-10 w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  item.isActive && "bg-secondary text-secondary-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="flex-1 text-left">{item.title}</span>
              </AccordionTrigger>
              <AccordionContent className="ml-10 mt-1 space-y-1 pb-1 pl-1 pt-0">
                {item.items.map((subItem, subIndex) => (
                  <Button
                    key={subIndex}
                    variant={subItem.isActive ? "secondary" : "ghost"}
                    className="h-8 w-full justify-start"
                    asChild
                  >
                    <Link href={subItem.url}>{subItem.title}</Link>
                  </Button>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ),
      )}
    </div>
  )
}

