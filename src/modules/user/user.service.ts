import { pool } from "../../config/db";

const getAllUsersService = async () => {
  const query = `
    SELECT id, name, email, phone, role
    FROM users
    ORDER BY id ASC;
  `;

  const { rows } = await pool.query(query);

  return rows;
};

export interface UpdateUserInput {
  name: string;
  email: string;
  phone: string;
  role: "admin" | "customer";
}

const updateUserService = async (userId: number, data: UpdateUserInput) => {
  const check = await pool.query("SELECT id FROM users WHERE id = $1", [
    userId,
  ]);
  if (check.rows.length === 0) {
    throw new Error("User not found");
  }

  const result = await pool.query(
    `
    UPDATE users
    SET name = $1,
        email = $2,
        phone = $3,
        role = $4
    WHERE id = $5
    RETURNING id, name, email, phone, role;
    `,
    [data.name, data.email, data.phone, data.role, userId]
  );

  return result.rows[0];
};

const isEmailTaken = async (email: string, excludeUserId: number) => {
  const q = `SELECT id FROM users WHERE email = $1 AND id <> $2 LIMIT 1;`;
  const r = await pool.query(q, [email, excludeUserId]);
  return r.rows.length > 0;
};

const deleteUserService = async (userId: number) => {
  // Check if user exists
  const userCheck = await pool.query(
    "SELECT id FROM users WHERE id = $1",
    [userId]
  );

  if (userCheck.rows.length === 0) {
    throw new Error("User not found");
  }

  // Check for active bookings
  const bookingCheck = await pool.query(
    "SELECT id FROM bookings WHERE customer_id = $1 AND status = 'active'",
    [userId]
  );

  if (bookingCheck.rows.length > 0) {
    throw new Error("Cannot delete user with active bookings");
  }

  // Delete user
  await pool.query("DELETE FROM users WHERE id = $1", [userId]);

  return true;
};

export { getAllUsersService, updateUserService, isEmailTaken, deleteUserService };