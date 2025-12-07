import { Router } from "express";
import { createBooking, getAllBookings } from "./bookings.controller";
import { auth } from "../../middleware/auth.middleware";

const router = Router();

router.post("/", auth, createBooking);
router.get("/", auth, getAllBookings);

export default router;
