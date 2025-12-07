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

export { getAllUsersService };
