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
