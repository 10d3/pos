/* eslint-disable @typescript-eslint/no-unused-vars */
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { siteInfo } from "@/lib/data";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthProvider } from "@/lib/auth/auth-context";
import { ROLE_PERMISSIONS, ROUTE_PERMISSIONS } from "@/lib/const";

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
};

export const metadata: Metadata = {
  title: siteInfo.title,
  description: siteInfo.description,
};

export default async function PosLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = (await auth()) as User;

  if (user === null) {
    redirect("/");
  }

  // Check if user has access to the current route based on their role
  const checkRouteAccess = (pathname: string, role: string) => {
    // Find the most specific matching route
    const matchingRoutes = Object.keys(ROUTE_PERMISSIONS)
      .filter((route) => pathname.startsWith(route))
      .sort((a, b) => b.length - a.length);

    if (matchingRoutes.length === 0) return true; // No route restriction defined

    const matchedRoute = matchingRoutes[0];
    const permission = ROUTE_PERMISSIONS[matchedRoute];

    return (
      // @ts-expect-error - We know the role exists in our permissions
      ROLE_PERMISSIONS[role]?.[permission] === true ||
      // @ts-expect-error - Handle object permissions
      (typeof ROLE_PERMISSIONS[role]?.[permission] === "object" &&
        // @ts-expect-error - At least view permission is required
        ROLE_PERMISSIONS[role]?.[permission]?.view === true)
    );
  };

  return (
    <AuthProvider initialUser={user}>
      <SidebarProvider>
        <AppSidebar user={user} />
        <main className="flex-1 h-screen overflow-auto">{children}</main>
      </SidebarProvider>
    </AuthProvider>
  );
}
