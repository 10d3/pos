// Ces fonctions seraient normalement connectées à votre base de données
// via Prisma ou une autre méthode d'accès aux données
"use server";
import { MenuItem } from "@/app/(pos)/pos/reports/inventory/_commponents/inventory-table";
import { prisma } from "../prisma";
import { CategoryType } from "@prisma/client";

export async function getMenuItems() {
  try {
    const menuItem = await prisma.menuItem.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return menuItem;
  } catch (error) {
    console.log(error);
  }
}

export async function createMenuItem(data: MenuItem) {
  console.log(data);
  try {
    const item = await prisma.menuItem.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category as CategoryType, // Ensure it's typed as CategoryType
        price: data.price,
        available: data.available,
        stock: data.stock,
        createdAt: new Date(),
      },
    });
    return item;
  } catch (error) {
    console.error("Error creating menu item:", error);
    throw error;
  }
}

export async function updateMenuItem(id: string, data: Partial<MenuItem>) {
  try {
    const updateItem = await prisma.menuItem.update({
      where: { id },
      data: {
        name: data.name || "",
        description: data.description || null,
        category: data.category as CategoryType || CategoryType.SPECIALITES,
        price: data.price || 0,
        available: data.available !== undefined ? data.available : true,
        stock: data.stock,
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

export async function deleteAllMenuItems() {
  try {
    // First, delete all OrderItems that reference MenuItems
    await prisma.orderItem.deleteMany({});

    // Then delete all MenuItems
    const deletedItems = await prisma.menuItem.deleteMany({});

    console.log(`Deleted ${deletedItems.count} menu items`);
    return { success: true, count: deletedItems.count };
  } catch (error) {
    console.error("Error deleting menu items:", error);
    throw error;
  }
}
