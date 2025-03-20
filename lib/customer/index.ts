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
    });

    return customers;
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

export async function getCustomersWithOrderStats() {
  try {
    // Get all customers
    const customers = await prisma.customer.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        orders: {
          include: {
            orderItems: true,
          },
        },
      },
    });

    // Calculate total items purchased for each customer
    const customersWithStats = customers.map((customer) => {
      // Calculate total items purchased
      const totalItemsPurchased = customer.orders.reduce((total, order) => {
        return (
          total +
          order.orderItems.reduce((orderTotal, item) => {
            return orderTotal + item.quantity;
          }, 0)
        );
      }, 0);

      // Return customer with stats
      return {
        ...customer,
        totalItemsPurchased,
        orders: undefined, // Remove the orders to keep the response size small
      };
    });

    return customersWithStats;
  } catch (error) {
    console.error("Error fetching customers with stats:", error);
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
      },
    });

    return customer;
  } catch (error) {
    console.error(`Error fetching customer with ID ${id}:`, error);
    return null;
  }
}
