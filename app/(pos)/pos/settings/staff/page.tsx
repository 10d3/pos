import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UsersTable } from "./_components/users-table";
import { AddUserDialog } from "./_components/add-user-dialog";
// import { Button } from "@/components/ui/button";
import { Search, UserCog } from "lucide-react";
import { Input } from "@/components/ui/input";
import { User } from "@/types/type";

export default async function page() {
  const user = (await auth()) as User;

  console.log(user)

  // Redirect if not admin
  if (!user || user.role !== "ADMIN") {
    redirect("/pos");
  }

  // Fetch all users
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-4">
        <div className="flex items-center gap-2">
          <UserCog className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-lg font-semibold">Gestion des Utilisateurs</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher des utilisateurs..."
              className="w-full pl-8 bg-muted/40"
            />
          </div>
          <AddUserDialog />
        </div>
      </div>

      <div className="flex-1 p-4">
        <UsersTable users={users} />
      </div>
    </div>
  );
}
