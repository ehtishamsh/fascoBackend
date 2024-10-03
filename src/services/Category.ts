import prismm from "../utils/db";

export async function All() {
  return await prismm.category.findMany();
}
export async function One(name: string) {
  return await prismm.category.findFirst({ where: { name: name } });
}
export async function Create(name: string) {
  return await prismm.category.create({ data: { name } });
}

export async function Delete(id: string) {
  return await prismm.category.delete({ where: { id } });
}
