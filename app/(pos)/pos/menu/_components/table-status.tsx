import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Table } from "@/lib/types";
import { OrderStatus } from "@prisma/client";

interface TableStatusProps {
  tables: Table[];
}

export function TableStatus({ tables }: TableStatusProps) {
  return (
    <div className="flex overflow-x-auto p-2">
      {tables.map((table) => (
        <div
          key={table.id}
          className={cn(
            "flex items-center p-4 mr-2 rounded-lg min-w-64 border",
            table.status === OrderStatus.PREPARING &&
              "bg-emerald-50/10 border-emerald-200/20"
          )}
        >
          <div className="h-12 w-12 rounded-lg bg-muted/50 flex items-center justify-center text-lg font-medium mr-4">
            {table.number}
          </div>
          <div className="flex-1">
            <div className="font-medium">{table.customerName}</div>
            <div className="text-sm text-muted-foreground flex items-center">
              {table.itemCount} items <ArrowRight className="h-3 w-3 mx-1" />{" "}
              Kitchen
            </div>
          </div>
          {table.status === OrderStatus.PREPARING && (
            <div className="text-xs bg-emerald-500/20 text-emerald-700 px-2 py-0.5 rounded-full">
              In process
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
