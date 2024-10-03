import { Router } from "express";
import {
  createProductController,
  editProduct,
  getAllProductsController,
  getFilterData,
  getProductByID,
  getProductController,
  getProductsByCate,
  getProductsBySearch,
} from "../controllers/productController";
import { deleteProduct } from "../services/Product";

const router = Router();

router.get("/products", getAllProductsController);
router.post("/products/new", createProductController);
router.get("/products/filter/:id", getFilterData);
router.get("/products/:id", getProductController);
router.get("/products/single/:id", getProductByID);
router.put("/products/edit", editProduct);
router.get("/products/category/:id", getProductsByCate);
router.get("/products/search/:query", getProductsBySearch);
router.delete("/products/:id", deleteProduct);

export default router;
