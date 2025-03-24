/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ROLE_PERMISSIONS, ROUTE_PERMISSIONS } from "@/lib/const";

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => void;
  checkPermission: (permission: string, action?: string) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading] = useState(false);
  const router = useRouter();
  //   const pathname = usePathname();

  // Check if user has permission to access current route
  const checkRoutePermission = (route: string, role: string) => {
    // Find the most specific matching route
    const matchingRoutes = Object.keys(ROUTE_PERMISSIONS)
      .filter((r) => route.startsWith(r))
      .sort((a, b) => b.length - a.length);

    if (matchingRoutes.length === 0) return true; // No route restriction defined

    const matchedRoute = matchingRoutes[0];
    const permission = ROUTE_PERMISSIONS[matchedRoute];

    return (
      // @ts-expect-error - We know the role exists in our permissions
      ROLE_PERMISSIONS[role]?.[permission] === true ||
      // @ts-expect-error - Handle object permissions
      (typeof ROLE_PERMISSIONS[role]?.[permission] === "object" &&
        //@ts-expect-error - At least view permission is required
        ROLE_PERMISSIONS[role]?.[permission]?.view === true)
    );
  };

  // Check specific permission for a user
  const checkPermission = (permission: string, action: string = "view") => {
    if (!user) return false;

    // @ts-expect-error - Dynamic access
    const permissionValue = ROLE_PERMISSIONS[user.role]?.[permission];

    if (typeof permissionValue === "boolean") {
      return permissionValue;
    } else if (typeof permissionValue === "object") {
      return permissionValue[action] === true;
    }

    return false;
  };

  const logout = () => {
    // Implement your logout logic here
    // For example:
    fetch("/api/auth/logout", { method: "POST" })
      .then(() => {
        setUser(null);
        router.push("/");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, checkPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
