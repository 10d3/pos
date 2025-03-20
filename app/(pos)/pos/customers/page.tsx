import {
  CalendarIcon,
  PlusCircle,
  Search,
  UserPlus,
  ShoppingBag,
  Award,
} from "lucide-react";
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
import { fr } from "date-fns/locale";
import { AddCustomerDialog } from "@/components/shared/customers/AddCustomer";
import { getCustomersWithOrderStats } from "@/lib/customer";

export default async function CustomersPage() {
  const customers = await getCustomersWithOrderStats();

  // Sort customers by total items purchased (descending)
  const sortedCustomers = [...customers].sort(
    (a, b) => (b.totalItemsPurchased || 0) - (a.totalItemsPurchased || 0)
  );

  // Get top customer
  const topCustomer = sortedCustomers.length > 0 ? sortedCustomers[0] : null;

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher des clients..."
            className="w-full pl-8 bg-muted/40"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            {new Date().toLocaleDateString('fr-FR')}
          </Button>
          <AddCustomerDialog />
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Clients
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
                Total Points Émis
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
                Nouveaux Clients (30 jours)
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
                Total Articles Achetés
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {customers.reduce(
                  (acc, customer) => acc + (customer.totalItemsPurchased || 0),
                  0
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-amber-500/10 border-amber-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-amber-700">
                Meilleur Client
              </CardTitle>
              <Award className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-amber-700">
                {topCustomer ? topCustomer.name : "Pas encore de clients"}
              </div>
              {topCustomer && (
                <div className="text-xs text-amber-600 mt-1">
                  {topCustomer.totalItemsPurchased || 0} articles achetés
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="col-span-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">
              Liste des Clients
            </CardTitle>
            <Button variant="outline" size="sm">
              Exporter
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Articles Achetés</TableHead>
                  <TableHead>Inscrit</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCustomers.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className={
                      customer.id === topCustomer?.id ? "bg-amber-50" : ""
                    }
                  >
                    <TableCell className="font-medium">
                      {customer.name}
                      {customer.id === topCustomer?.id && (
                        <Badge className="ml-2 bg-amber-500/20 text-amber-700 border-amber-500/30">
                          Meilleur Client
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {customer.points} pts
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono bg-blue-50">
                        {customer.totalItemsPurchased || 0} articles
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(customer.createdAt), {
                        addSuffix: true,
                        locale: fr
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
                        {customer.points > 100 ? "VIP" : "Régulier"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Voir
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