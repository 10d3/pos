"use client"

import { CalendarIcon, Search } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatsCard } from "./_components/stats-card"
import { TopDishes } from "./_components/top-dishes"
import { Overview } from "./_components/dashboard"

export default function DashboardPage() {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="w-full pl-8 bg-muted/40" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            Feb 4, 2023
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Revenue" value="$1,200.56" icon="dollar" className="bg-violet-500/10" />
          <StatsCard title="Paid Orders" value="198" icon="receipt" />
          <StatsCard title="Tip Amount" value="$186.72" icon="tip" />
          <StatsCard title="Dishes Sold" value="227" icon="dish" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-full lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">Today&apos;s Upsale</CardTitle>
              <Button variant="link" className="h-8 px-2 lg:px-3" asChild>
                <Link href="/pos/menu">See All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <TopDishes />
            </CardContent>
          </Card>
          <Card className="col-span-full lg:col-span-4">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">Accepted Orders</CardTitle>
              <Select defaultValue="week">
                <SelectTrigger className="h-8 w-[120px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

