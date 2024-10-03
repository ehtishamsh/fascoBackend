import { Router } from "express";
import {
  getAllCategories,
  createCategory,
  deleteCategory,
} from "../controllers/categoryController";
const router = Router();
router.get("/categories", getAllCategories);
router.post("/categories/new", createCategory);
router.delete("/categories/:id", deleteCategory);

export default router;
