import { Router } from "express";
import {
  createOrderController,
  getUserOrdersController,
  getOrderDetail,
  updateOrderController,
  getAllOrders,
} from "../controllers/orderControllar";

const router = Router();

router.get("/orders", getAllOrders);
router.post("/order/create", createOrderController);
router.get("/order/user/:id", getUserOrdersController);
router.get("/order/:id", getOrderDetail);
router.put("/order/update", updateOrderController);
export default router;
