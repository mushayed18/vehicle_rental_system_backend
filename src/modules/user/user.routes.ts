import { Router } from "express";
import { getAllUsers } from "./user.controller";
import { auth } from "../../middleware/auth.middleware";
import { adminOnly } from "../../middleware/admin.middleware";

const router = Router();

router.get("/", auth, adminOnly, getAllUsers);

export default router;
