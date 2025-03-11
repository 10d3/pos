import { prisma } from "@/lib/prisma";
import React from "react";

export default async function page() {
  const menus = await prisma.menuItem.findMany();
  console.log(menus)
  return <div>page</div>;
}
