import prisma from "../utils/db";

export async function All() {
  return await prisma?.brand?.findMany();
}

export async function FindOne(name: string) {
  return await prisma?.brand?.findFirst({ where: { name } });
}

export async function CreateBrand(name: string) {
  return await prisma?.brand?.create({ data: { name } });
}

export async function DeleteBrand(id: string) {
  return await prisma?.brand?.delete({ where: { id } });
}
