import { Router } from "express";
import {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from "./vehicle.controller";
import { auth } from "../../middleware/auth.middleware";
import { adminOnly } from "../../middleware/admin.middleware";

const router = Router();

router.post("/", auth, adminOnly, createVehicle);
router.get("/", getAllVehicles);
router.get("/:vehicleId", getVehicleById);
router.put("/:vehicleId", auth, adminOnly, updateVehicle);
router.delete("/:vehicleId", auth, adminOnly, deleteVehicle);

export default router;
