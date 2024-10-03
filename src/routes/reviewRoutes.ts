import { Router } from "express";
import {
  addReview,
  getReviewByProductSlug,
  getReviewsByOrderID,
  orderReview,
} from "../controllers/reviewController";

const router = Router();

router.get("/reviews/user/:uid", orderReview);
router.post("/reviews", addReview);
router.get("/reviews/:id", getReviewsByOrderID);
router.get("/reviews/product/:id", getReviewByProductSlug);
export default router;
