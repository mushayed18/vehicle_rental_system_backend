import { Router } from "express";
import { createVehicle, getAllVehicles, getVehicleById } from "./vehicle.controller";
import { auth } from "../../middleware/auth.middleware";
import { adminOnly } from "../../middleware/admin.middleware";

const router = Router();

router.post("/", auth, adminOnly, createVehicle);
router.get("/", getAllVehicles);
router.get("/:vehicleId", getVehicleById);

export default router;
