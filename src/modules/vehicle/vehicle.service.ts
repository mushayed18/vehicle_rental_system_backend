import { pool } from "../../config/db";

interface VehicleInput {
  vehicle_name: string;
  type: "car" | "bike" | "van" | "SUV";
  registration_number: string;
  daily_rent_price: number;
  availability_status: "available" | "booked";
}

const createVehicleService = async (input: VehicleInput) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = input;

  // Check if registration number already exists
  const existing = await pool.query(
    "SELECT * FROM vehicles WHERE registration_number = $1",
    [registration_number]
  );

  if (existing.rows.length > 0) {
    throw new Error("Registration number already exists");
  }

  const result = await pool.query(
    `INSERT INTO vehicles 
      (vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result.rows[0];
};

const getAllVehiclesService = async () => {
  const query = `
    SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status
    FROM vehicles
    ORDER BY id ASC;
  `;

  const { rows } = await pool.query(query);
  return rows;
};

const getVehicleByIdService = async (id: number) => {
  const query = `
    SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status
    FROM vehicles
    WHERE id = $1
    LIMIT 1;
  `;

  const { rows } = await pool.query(query, [id]);

  return rows[0] || null;
};

const updateVehicleService = async (vehicleId: number, input: VehicleInput) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = input;

  // check if vehicle exists
  const existing = await pool.query("SELECT * FROM vehicles WHERE id = $1", [
    vehicleId,
  ]);

  if (existing.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  // update ALL fields
  const result = await pool.query(
    `
      UPDATE vehicles
      SET 
        vehicle_name = $1,
        type = $2,
        registration_number = $3,
        daily_rent_price = $4,
        availability_status = $5
      WHERE id = $6
      RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status
    `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      vehicleId,
    ]
  );

  return result.rows[0];
};

const deleteVehicleService = async (vehicleId: number) => {
  // check if the vehicle exists
  const result = await pool.query(
    "SELECT availability_status FROM vehicles WHERE id = $1",
    [vehicleId]
  );

  if (result.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  const vehicle = result.rows[0];

  // prevent deletion if vehicle is booked
  if (vehicle.availability_status === "booked") {
    throw new Error("Vehicle cannot be deleted while it has an active booking");
  }

  // delete the vehicle
  await pool.query("DELETE FROM vehicles WHERE id = $1", [vehicleId]);

  return true;
};

export {
  createVehicleService,
  getAllVehiclesService,
  getVehicleByIdService,
  updateVehicleService,
  deleteVehicleService,
};
