/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { UsersTable } from "./_components/users-table";
import { AddUserDialog } from "./_components/add-user-dialog";
// import { PermissionButton } from "@/components/shared/permission-button";
import { useAuth } from "@/lib/auth/auth-context";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { PermissionButton } from "@/components/shared/PermissionButton";
// import { ProtectedRoute } from "@/components/shared/protected-route";

export default function StaffPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ProtectedRoute requiredPermission="staff" requiredAction="view">
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Gestion du personnel
            </h1>
            <p className="text-muted-foreground">
              Gérez les comptes utilisateurs et leurs permissions
            </p>
          </div>

          <PermissionButton
            permission="staff"
            action="create"
            fallback={<div className="h-10"></div>}
            asChild
          >
            <AddUserDialog />
          </PermissionButton>
        </div>

        <UsersTable users={users} />
      </div>
    </ProtectedRoute>
  );
}
