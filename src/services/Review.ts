import prisma from "../utils/db";

export async function getAll() {
  return await prisma.review.findMany();
}

export async function getOne(userid: string, productid: string) {
  return await prisma.review.findMany({
    where: {
      userId: userid,
      productId: productid,
    },
  });
}
export async function getReviewsByUserID(id: string) {
  return await prisma.review.findMany({
    where: {
      userId: id,
    },
  });
}
export async function create({
  comment,
  rating,
  userid,
  productId,
}: {
  comment: string;
  rating: number;
  userid: string;
  productId: string;
}) {
  return await prisma.review.create({
    data: {
      comment: comment,
      rating,
      productId,
      userId: userid,
    },
  });
}

export async function getReviewsByUserIDandProductID({
  userid,
  productid,
}: {
  userid: string;
  productid: string;
}) {
  return await prisma.review.findFirst({
    where: {
      userId: userid,
      productId: productid,
    },
    select: {
      comment: true,
      rating: true,
      product: {
        select: {
          cover: true,
          slug: true,
          title: true,
          brand: {
            select: {
              name: true,
            },
          },
          category: {
            select: {
              name: true,
            },
          },
        },
      },
      createdAt: true,
    },
  });
}

export async function getReviewsByProductID(id: string) {
  return await prisma.review.findMany({
    where: {
      productId: id,
    },
    select: {
      id: true,
      comment: true,
      createdAt: true,
      rating: true,
      updatedAt: true,
      productId: true,
      userId: true,
      user: {
        select: {
          firstname: true,
          lastname: true,
        },
      },
    },
  });
}
