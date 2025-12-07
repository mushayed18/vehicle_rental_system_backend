import express, { Request, Response } from "express";
import initDB from "./config/db";
import authRoutes from "./modules/auth/auth.routes";
import vehicleRoutes from "./modules/vehicle/vehicle.routes";
import userRoutes from "./modules/user/user.routes";
import bookingsRoutes from "./modules/bookings/bookings.routes";

const app = express();

// database initialization
initDB();

// parser
app.use(express.json());

app.get("/api/v1/", (req: Request, res: Response) => {
  res.send("Vehicle rental system!");
});

// Auth routes
app.use("/api/v1/auth", authRoutes);

// Vehicle routes
app.use("/api/v1/vehicles", vehicleRoutes);

// User routes
app.use("/api/v1/users", userRoutes);

// bookings routes
app.use("/api/v1/bookings", bookingsRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;
