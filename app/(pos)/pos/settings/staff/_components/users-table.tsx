/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { EditUserDialog } from "./edit-user-dialog";
import { DeleteUserDialog } from "./delete-user-dialog";
import { ROLE_LABELS } from "@/lib/const";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // Function to get badge variant based on role
  const getBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return { variant: "default", className: "bg-primary" };
      case "MANAGER":
        return {
          variant: "outline",
          className: "bg-green-500/10 text-green-500 border-green-500/20",
        };
      case "STAFF":
        return {
          variant: "outline",
          className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        };
      case "CASHIER":
        return {
          variant: "outline",
          className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        };
      case "WAITER":
        return {
          variant: "outline",
          className: "bg-purple-500/10 text-purple-500 border-purple-500/20",
        };
      case "KITCHEN":
        return {
          variant: "outline",
          className: "bg-orange-500/10 text-orange-500 border-orange-500/20",
        };
      case "INVENTORY":
        return {
          variant: "outline",
          className: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
        };
      case "READONLY":
        return {
          variant: "outline",
          className: "bg-gray-500/10 text-gray-500 border-gray-500/20",
        };
      default:
        return {
          variant: "outline",
          className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        };
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Créé</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge
                  variant={getBadgeVariant(user.role).variant as any}
                  className={getBadgeVariant(user.role).className}
                >
                  {ROLE_LABELS[user.role] || user.role}
                </Badge>
              </TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(user.createdAt), {
                  addSuffix: true,
                  locale: fr,
                })}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setEditingUser(user)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeletingUser(user)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingUser && (
        <EditUserDialog
          user={editingUser}
          open={!!editingUser}
          onOpenChange={() => setEditingUser(null)}
        />
      )}

      {deletingUser && (
        <DeleteUserDialog
          user={deletingUser}
          open={!!deletingUser}
          onOpenChange={() => setDeletingUser(null)}
        />
      )}
    </div>
  );
}
