// Ces fonctions seraient normalement connectées à votre base de données
// via Prisma ou une autre méthode d'accès aux données

import { MenuItem } from "@/app/(pos)/pos/reports/inventory/_commponents/inventory-table";
import { prisma } from "../prisma";

export async function getMenuItems() {
  try {
    const menuItem = await prisma.menuItem.findMany();
    return menuItem;
  } catch (error) {
    console.log(error);
  }
}

export async function createMenuItem(data: Omit<MenuItem, "id" | "createdAt">) {
  try {
    const item = await prisma.menuItem.create({
      data: {
        ...data,
      },
    });
    return item;
  } catch (error) {
    console.log(error);
  }
}

export async function updateMenuItem(id: string, data: Partial<MenuItem>) {
  try {
    const updateItem = await prisma.menuItem.update({
      where: { id },
      data: {
        name: data.name || "",
        description: data.description || null,
        category: data.category || "",
        price: data.price || 0,
        available: data.available !== undefined ? data.available : true,
        createdAt: new Date(),
      },
    });
    return updateItem;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteMenuItem(id: string) {
  try {
    return await prisma.menuItem.delete({ where: { id } });
  } catch (error) {
    console.log(error);
  }
}
