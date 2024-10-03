import { Router } from "express";
import { Create, GetAll, deleteBrand } from "../controllers/brandController";

const router = Router();

router.get("/brands", GetAll);
router.post("/brands/new", Create);
router.delete("/brands/:id", deleteBrand);

export default router;
