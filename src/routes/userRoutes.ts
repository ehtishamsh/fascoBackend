import { Router } from "express";

import { login } from "../controllers/loginController";
import { updateUser } from "../controllers/userController";
import { register } from "../controllers/registerController";

const router = Router();

router.post("/api/login", login);
router.post("/api/register", register);
router.put("/api/user/update", updateUser);
export default router;
