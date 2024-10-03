import { Request, Response, query } from "express";
import {
  checkExistingOrder,
  checkOrderItems,
  createOrderItems,
  createOrder,
  getOrderByUserID,
  getOrderByOrderNumber,
  updateOrderStatus,
  allOrders,
  refundStatus,
} from "../services/Order";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
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
  categoryId: string;
  screenType?: string;
  sensor?: string;
  zoom?: string;
  features?: string;
  connectivity?: string;
  lens?: string;
  megapixels?: string;
  aperture?: string;
  videoResolution?: string;
  batteryLife?: string;
  gpu?: string;
  compatibleGames?: string;
  maxResolution?: string;
  microphone?: boolean;
  noiseCancellation?: boolean;
  wireless?: boolean;
  numberOfControllers?: string;
  storage?: string;
  type?: string;

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
export async function createOrderController(req: Request, res: Response) {
  const data: OrderData = req.body;

  try {
    if (data.products.length === 0) {
      return res
        .status(400)
        .json({ message: "No products in the cart", status: 400 });
    }
    const checkifOrderExists = await checkExistingOrder(data.payment_intentId);
    if (checkifOrderExists) {
      const orderItems = await checkOrderItems(checkifOrderExists.id);
      if (orderItems.length > 0) {
        return res
          .status(400)
          .json({ message: "Order already exists", status: 400 });
      }

      return res
        .status(400)
        .json({ message: "Order Already exists", status: 400 });
    }

    const total = data.products.reduce((acc, product) => {
      const productTotal =
        (Number(product.discounted) > 0
          ? Number(product.discounted)
          : Number(product.price)) +
        Number(product.selectedVariant?.price || 0) * Number(product.quantity);
      return acc + productTotal;
    }, 0);
    const order = await createOrder(data, total, data.addressId, data.userId);
    if (!order) {
      return res
        .status(400)
        .json({ message: "Error creating order", status: 400 });
    }

    const orderItems = await createOrderItems(order.id, data.products);
    if (!orderItems) {
      return res
        .status(400)
        .json({ message: "Error creating order items", status: 400 });
    }

    return res.status(200).json({
      message: "Order created successfully",
      status: 200,
      order,
      orderItems,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.json({ message: "Error creating order", status: 400 });
  }
}

export async function getUserOrdersController(req: Request, res: Response) {
  try {
    const userId = req.params.id;
    const recentOrders = await getOrderByUserID(userId);

    if (!recentOrders) {
      return res.status(404).json({ message: "Orders not found", status: 404 });
    }

    return res.status(200).json({
      message: "Orders fetched successfully",
      status: 200,
      data: recentOrders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.json({ message: "Error fetching orders", status: 400 });
  }
}

export async function getOrderDetail(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const order = await getOrderByOrderNumber(Number(id));

    if (!order) {
      return res.status(404).json({ message: "Order not found", status: 404 });
    }

    return res.status(200).json({
      message: "Order fetched successfully",
      status: 200,
      data: order,
    });
  } catch {
    res
      .status(400)
      .json({ message: "Error fetching order items", status: 400 });
  }
}

export async function updateOrderController(req: Request, res: Response) {
  const { status, orderNumber, orderStatus, payment_intent_id } = req.body;
  try {
    if (!status || !orderNumber) {
      return res
        .status(400)
        .json({ message: "All fields are required", status: 400 });
    }
    const findorder = await getOrderByOrderNumber(Number(orderNumber));
    if (!findorder) {
      return res.status(404).json({ message: "Order not found", status: 404 });
    }
    const order = await updateOrderStatus(orderNumber, orderStatus, status);

    if (!order) {
      return res
        .status(400)
        .json({ message: "Error updating order", status: 400 });
    }
    if (orderStatus === "CANCELLED" && payment_intent_id) {
      const refund = await stripe.refunds.create({
        payment_intent: payment_intent_id,
      });
      const updatedOrder = await refundStatus(order.id);
      return res.status(200).json({
        message: "Order updated successfully",
        status: 200,
        data: updatedOrder,
        success: true,
        refund,
      });
    }

    return res.status(200).json({
      message: "Order updated successfully",
      status: 200,
      data: order,
      success: true,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return res
      .status(400)
      .json({ message: "Error updating order", status: 400 });
  }
}

export async function getAllOrders(req: Request, res: Response) {
  try {
    const getOrders = await allOrders();
    if (!getOrders) {
      res.status(400).json({
        message: "Faild to get orders",
      });
    }
    res.status(200).json({
      message: "All orders fetched successfully",
      orders: getOrders,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error updating order", status: 400 });
  }
}
