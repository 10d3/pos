import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface NavShortcutsProps {
  shortcuts: {
    name: string
    url: string
    icon: LucideIcon
    color: string
  }[]
}

export function NavShortcuts({ shortcuts }: NavShortcutsProps) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {shortcuts.map((shortcut) => (
        <Link
          key={shortcut.name}
          href={shortcut.url}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            shortcut.color,
            "hover:bg-accent hover:text-accent-foreground",
          )}
        >
          <shortcut.icon className="h-5 w-5" />
          <span>{shortcut.name}</span>
        </Link>
      ))}
    </div>
  )
}

