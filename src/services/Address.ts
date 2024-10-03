import prisma from "../utils/db";

interface Address {
  firstname: string;
  lastname: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  default: boolean;
  shipping: boolean;
  billing: boolean;
  userId: string;
}
export async function GETALL() {
  const data = await prisma?.address?.findMany();
  return data;
}

export async function GETBYID(id: string) {
  const data = await prisma?.address?.findFirst({
    where: {
      id: id,
    },
  });
  return data;
}

export async function GETBYUSERID(id: string) {
  const data = await prisma?.address?.findMany({
    where: {
      userId: id,
    },
  });
  return data;
}

export async function CREATE(data: Address) {
  return await prisma.address.create({ data });
}

export async function UPDATE(id: string, data: Address) {
  return await prisma.address.update({ where: { id }, data });
}
export async function DELETE(id: string) {
  return await prisma.address.delete({ where: { id } });
}
