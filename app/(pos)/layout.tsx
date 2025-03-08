import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { siteInfo } from "@/lib/data";
import { Metadata } from "next";
import { redirect } from "next/navigation";

type User = {
  id: string
  name: string;
  email: string;
  avatar: string;
  role: string
}

export const metadata: Metadata = {
  title: siteInfo.title,
  description: siteInfo.description,
};
export default async function PosLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await auth() as User;

  console.log(user)

  if (user === null) {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <main className="flex-1 h-screen">
        <SidebarTrigger className=" absolute" />
        {children}
      </main>
    </SidebarProvider>
  );
}
