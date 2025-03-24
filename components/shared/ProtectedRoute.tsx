"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROUTE_PERMISSIONS } from "@/lib/const";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredAction?: string;
}

export function ProtectedRoute({
  children,
  requiredPermission,
  requiredAction = "view",
}: ProtectedRouteProps) {
  const { user, loading, checkPermission } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
      return;
    }

    // If specific permission is required, check it
    if (!loading && user && requiredPermission) {
      const hasPermission = checkPermission(requiredPermission, requiredAction);
      if (!hasPermission) {
        router.push("/pos");
      }
    }

    // Check route-based permission
    if (!loading && user && pathname) {
      const matchingRoutes = Object.keys(ROUTE_PERMISSIONS)
        .filter((route) => pathname.startsWith(route))
        .sort((a, b) => b.length - a.length);

      if (matchingRoutes.length > 0) {
        const matchedRoute = matchingRoutes[0];
        const permission = ROUTE_PERMISSIONS[matchedRoute];
        const hasPermission = checkPermission(permission, "view");

        if (!hasPermission) {
          router.push("/pos");
        }
      }
    }
  }, [
    loading,
    user,
    router,
    pathname,
    requiredPermission,
    requiredAction,
    checkPermission,
  ]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
