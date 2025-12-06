import { Router } from "express";
import { signup, signin } from "./auth.controller";

const router = Router();

// POST /api/v1/auth
router.post("/signup", signup);
router.post("/signin", signin);

export default router;
