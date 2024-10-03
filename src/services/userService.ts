import prisma from "../utils/db";

const getAllUsers = async () => {
  return await prisma.user.findMany();
};

export default { getAllUsers };
