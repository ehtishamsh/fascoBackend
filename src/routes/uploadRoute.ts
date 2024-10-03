import { Router } from "express";
import { DeleteFile, UploadFile } from "../controllers/uploadController";

const router = Router();

router.post("/upload", UploadFile);
router.delete("/upload/delete", DeleteFile);
export default router;
