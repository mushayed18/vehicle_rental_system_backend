import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";

interface BookingInput {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
}

const createBookingService = async (input: BookingInput) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = input;

  // Validate dates
  const startDate = new Date(rent_start_date);
  const endDate = new Date(rent_end_date);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error("Invalid dates provided");
  }

  if (endDate <= startDate) {
    throw new Error("rent_end_date must be after rent_start_date");
  }

  const numberOfDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Check if vehicle exists and is available
  const vehicleQuery = await pool.query(
    "SELECT id, vehicle_name, daily_rent_price, availability_status FROM vehicles WHERE id = $1",
    [vehicle_id]
  );

  if (vehicleQuery.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  const vehicle = vehicleQuery.rows[0];

  if (vehicle.availability_status !== "available") {
    throw new Error("Vehicle is currently booked");
  }

  // Calculate total price
  const total_price = Number(vehicle.daily_rent_price) * numberOfDays;

  // Insert booking
  const bookingQuery = await pool.query(
    `INSERT INTO bookings 
      (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES ($1, $2, $3, $4, $5, 'active')
     RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  // Update vehicle status to "booked"
  await pool.query(
    "UPDATE vehicles SET availability_status = 'booked' WHERE id = $1",
    [vehicle_id]
  );

  const booking = bookingQuery.rows[0];

  return {
    ...booking,
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: Number(vehicle.daily_rent_price),
    },
  };
};

const getAllBookingsService = async (user: JwtPayload) => {
  if (user.role === "admin") {
    // Admin sees all bookings with customer and vehicle info
    const query = `
      SELECT 
        b.id, b.customer_id, b.vehicle_id, b.rent_start_date, b.rent_end_date, b.total_price, b.status,
        json_build_object('name', u.name, 'email', u.email) as customer,
        json_build_object('vehicle_name', v.vehicle_name, 'registration_number', v.registration_number) as vehicle
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.id ASC
    `;
    const { rows } = await pool.query(query);
    return rows;
  } else {
    // Customer sees only their own bookings with vehicle info
    const query = `
      SELECT 
        b.id, b.vehicle_id, b.rent_start_date, b.rent_end_date, b.total_price, b.status,
        json_build_object('vehicle_name', v.vehicle_name, 'registration_number', v.registration_number, 'type', v.type) as vehicle
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.customer_id = $1
      ORDER BY b.id ASC
    `;
    const { rows } = await pool.query(query, [user.id]);
    return rows;
  }
};

interface UpdateBookingInput {
  bookingId: number;
  status: "cancelled" | "returned";
  user: { id: number; role: "admin" | "customer" };
}

const updateBookingService = async (input: UpdateBookingInput) => {
  const { bookingId, status, user } = input;

  // Check if booking exists
  const { rows: bookingRows } = await pool.query(
    "SELECT * FROM bookings WHERE id = $1",
    [bookingId]
  );

  if (bookingRows.length === 0) {
    throw new Error("Booking not found");
  }

  const booking = bookingRows[0];

  // Role-based rules
  if (user.role === "customer" && booking.customer_id !== user.id) {
    throw new Error("You can only modify your own bookings");
  }

  if (status === "cancelled" && user.role !== "customer" && user.role !== "admin") {
    throw new Error("Only customers or admins can cancel bookings");
  }

  if (status === "returned" && user.role !== "admin") {
    throw new Error("Only admins can mark bookings as returned");
  }

  // Update booking status
  const { rows: updatedRows } = await pool.query(
    `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
    [status, bookingId]
  );

  const updatedBooking = updatedRows[0];

  // Update vehicle availability if needed
  if (status === "cancelled" || status === "returned") {
    await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
      [updatedBooking.vehicle_id]
    );
  }

  // Include vehicle availability in response if returned
  if (status === "returned") {
    const { rows: vehicleRows } = await pool.query(
      `SELECT availability_status FROM vehicles WHERE id = $1`,
      [updatedBooking.vehicle_id]
    );
    updatedBooking.vehicle = vehicleRows[0];
  }

  return updatedBooking;
};

export { createBookingService, getAllBookingsService, updateBookingService };
