import { CalendarIcon, PlusCircle, Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { getCustomers } from "@/lib/customer";
import { AddCustomerDialog } from "@/components/shared/customers/AddCustomer";

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="w-full pl-8 bg-muted/40"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            {new Date().toLocaleDateString()}
          </Button>
          <AddCustomerDialog />
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Customers
              </CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Points Issued
              </CardTitle>
              <PlusCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {customers.reduce((acc, customer) => acc + customer.points, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                New Customers (30 days)
              </CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  customers.filter(
                    (customer) =>
                      new Date(customer.createdAt) >
                      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                  ).length
                }
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Points per Customer
              </CardTitle>
              <PlusCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {customers.length
                  ? Math.round(
                      customers.reduce(
                        (acc, customer) => acc + customer.points,
                        0
                      ) / customers.length
                    )
                  : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="col-span-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">
              Customer List
            </CardTitle>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      {customer.name}
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {customer.points} pts
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(customer.createdAt), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          customer.points > 100
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                        }
                      >
                        {customer.points > 100 ? "VIP" : "Regular"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
