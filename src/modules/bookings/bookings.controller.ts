import { Request, Response } from "express";
import {
  createBookingService,
  getAllBookingsService,
  updateBookingService,
} from "./bookings.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
      req.body;

    // If logged-in user is a customer
    if (req.user!.role === "customer" && req.user!.id !== customer_id) {
      return res.status(403).json({
        success: false,
        message: "Customers can only create bookings for themselves",
      });
    }

    if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const booking = await createBookingService({
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    const bookings = await getAllBookingsService(user);

    if (bookings.length === 0) {
      return res.status(200).json({
        success: true,
        message:
          user.role === "admin" ? "No bookings found" : "You have no bookings",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message:
        user.role === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully",
      data: bookings,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve bookings",
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = parseInt(req.params.bookingId as string);
    const { status } = req.body;
    const user = req.user as { id: number; role: "admin" | "customer" };

    if (!status || (status !== "cancelled" && status !== "returned")) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'cancelled' or 'returned'",
      });
    }

    const updatedBooking = await updateBookingService({
      bookingId,
      status,
      user,
    });

    let message = "";
    if (status === "cancelled") {
      message = "Booking cancelled successfully";
    } else if (status === "returned") {
      message = "Booking marked as returned. Vehicle is now available";
    }

    return res.status(200).json({
      success: true,
      message,
      data: updatedBooking,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update booking",
    });
  }
};

export { createBooking, getAllBookings, updateBooking };
