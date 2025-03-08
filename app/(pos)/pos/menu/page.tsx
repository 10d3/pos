import React from "react";
import RestaurantPOS from "./_components/client-container";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface user{
  id: string,
  name : string,
  email: string,
  role: string
}

export default async function page() {
  const user = await auth() as user
  const menuItems = await prisma.menuItem.findMany()
  console.log(menuItems)
  return (
    <div>
      <RestaurantPOS user={user} menuItems={menuItems} />
    </div>
  );
}
