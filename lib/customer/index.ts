import { FormValues } from "@/components/shared/customers/AddCustomer";
import { prisma } from "../prisma";

export const addCustomer = async (data: FormValues) => {
  try {
    const addCustomerToDB = await prisma.customer.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
    });
    return addCustomerToDB;
  } catch (error) {
    return error;
  }
};

export async function getCustomers() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        orders: {
          select: {
            id: true,
          },
        },
        loyaltyTransactions: {
          select: {
            points: true,
            type: true,
          },
        },
      },
    });

    return customers;
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

export async function getCustomerById(id: string) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            orderItems: {
              include: {
                menuItem: true,
              },
            },
          },
        },
        loyaltyTransactions: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return customer;
  } catch (error) {
    console.error(`Error fetching customer with ID ${id}:`, error);
    return null;
  }
}
