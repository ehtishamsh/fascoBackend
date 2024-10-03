import { Prisma } from "@prisma/client";
import prisma from "../utils/db";

interface OrderData {
  addressId: string;
  userId: string;
  payment_intentId: string;
  payment_status: string;
  products: Product[];
}
interface Product {
  id: string;
  title: string;
  price: string;
  stock: number;
  discounted: string;
  variants: [
    {
      id: string;
      name: string;
      price: string;
    }
  ];
  colors: [
    {
      id: string;
      name: string;
    }
  ];

  description: string;
  category: string;
  brand: string;
  cover: string;
  screenSize: string;
  cpu: string;
  cores: string;
  mainCamera: string;
  frontCamera?: string;
  battery: string;
  ram: string;
  quantity?: number;
  slug: string;
  selectedVariant?: {
    id: string;
    name: string;
    price: string;
  };
  selectedColor?: {
    id: string;
    name: string;
  };
}
export async function checkExistingOrder(paymentIntentId: string) {
  return await prisma.order.findFirst({
    where: {
      paymentIntentId,
    },
  });
}

export async function checkOrderItems(orderId: string) {
  return await prisma.orderItem.findMany({
    where: {
      orderId,
    },
  });
}

export async function createOrder(
  data: OrderData,
  total: number,
  addressId: string,
  userId: string
) {
  return await prisma.order.create({
    data: {
      orderNumber: Math.floor(Math.random() * 100000),
      addressId: addressId,
      userId: userId,
      amount: total,
      orderStatus: "PENDING",
      status: ["Your Order has been placed."],
      currency: "usd",
      paymentIntentId: data.payment_intentId,
      paymentStatus: data.payment_status === "paid" ? "PAID" : "PENDING",
    },
  });
}

export async function refundStatus(orderId: string) {
  return await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      updatedAt: new Date(),
      paymentStatus: "REFUNDED",
    },
  });
}
export async function createOrderItems(orderId: string, products: Product[]) {
  return await Promise.all(
    products.map(async (product) => {
      return await prisma.orderItem.create({
        data: {
          orderId,
          productId: product.id,
          variantId: product.selectedVariant?.id,
          colorID: product.selectedColor?.id,
          quantity: product.quantity || 1,
          price:
            Number(product.discounted) > 0
              ? Number(product.discounted)
              : Number(product.price),
          total:
            ((Number(product.discounted) > 0
              ? Number(product.discounted)
              : Number(product.price)) +
              Number(product.selectedVariant?.price)) *
            Number(product.quantity),
        },
      });
    })
  );
}

export async function getAllOrders() {
  return await prisma.order.findMany();
}

export async function getOrderById(id: string) {
  return await prisma.order.findUnique({
    where: {
      id,
    },
  });
}
export async function getOrderByOrderNumber(orderNumber: number) {
  return await prisma.order.findUnique({
    where: {
      orderNumber,
    },
    select: {
      id: true,
      updatedAt: true,
      address: true,
      amount: true,
      currency: true,
      orderNumber: true,
      status: true,
      paymentStatus: true,
      paymentIntentId: true,
      user: {
        select: {
          email: true,
          firstname: true,
          lastname: true,
        },
      },
      createdAt: true,
      orderStatus: true,
      items: {
        select: {
          id: true,
          price: true,
          total: true,
          variant: {
            select: {
              price: true,
              variant: true,
            },
          },
          color: {
            select: {
              color: true,
            },
          },
          quantity: true,
          product: {
            select: {
              title: true,
              category: {
                select: {
                  name: true,
                },
              },
              createdAt: true,
              brand: {
                select: {
                  name: true,
                },
              },
              id: true,
              price: true,
              slug: true,
              updatedAt: true,
              cover: true,
              description: true,
            },
          },
        },
      },
    },
  });
}

export async function getOrderItemsByOrderId(orderId: string) {
  return await prisma.orderItem.findMany({
    where: {
      orderId,
    },
  });
}
export async function getOrderByUserID(id: string) {
  return await prisma.order.findMany({
    where: {
      userId: id,
    },
    select: {
      id: true,
      address: true,
      paymentIntentId: true,
      amount: true,
      currency: true,
      orderNumber: true,
      status: true,
      paymentStatus: true,
      createdAt: true,
      orderStatus: true,
      items: {
        select: {
          id: true,
          price: true,
          total: true,
          variant: {
            select: {
              price: true,
              variant: true,
            },
          },
          color: {
            select: {
              color: true,
            },
          },
          quantity: true,
          product: true,
        },
      },
    },
  });
}

enum OrderStatus {
  PENDING = "PENDING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export async function updateOrderStatus(
  orderNumber: string,
  orderStatus: OrderStatus,
  status: string[]
) {
  return await prisma.order.update({
    where: {
      orderNumber: parseInt(orderNumber),
    },
    data: {
      updatedAt: new Date(),
      orderStatus: {
        set: orderStatus,
      } as Prisma.EnumOrderStatusFieldUpdateOperationsInput,
      status,
    },
  });
}

export async function allOrders() {
  return await prisma.order.findMany({
    select: {
      id: true,
      address: true,
      amount: true,
      currency: true,
      orderNumber: true,
      status: true,
      user: {
        select: {
          id: true,
        },
      },
      paymentStatus: true,
      paymentIntentId: true,
      createdAt: true,
      orderStatus: true,
      items: {
        select: {
          id: true,
          price: true,
          total: true,
          variant: {
            select: {
              price: true,
              variant: true,
            },
          },
          color: {
            select: {
              color: true,
            },
          },
          quantity: true,
          product: {
            select: {
              discounted: true,
              title: true,
              category: {
                select: {
                  name: true,
                },
              },
              createdAt: true,
              brand: {
                select: {
                  name: true,
                },
              },
              id: true,
              price: true,
              slug: true,
              updatedAt: true,
              cover: true,
              description: true,
            },
          },
        },
      },
    },
  });
}

export async function getOrderByProductId(productId: string) {
  return await prisma.orderItem.findMany({
    where: {
      productId,
    },
    select: {
      id: true,
      price: true,
      total: true,
      variant: {
        select: {
          price: true,
          variant: true,
        },
      },
      color: {
        select: {
          color: true,
        },
      },
      product: true,
    },
  });
}
