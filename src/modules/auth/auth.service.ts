import { pool } from '../../config/db'; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "admin" | "customer";
}

interface LoginInput {
  email: string;
  password: string;
}

const registerUser = async (input: RegisterInput) => {
  const { name, email, password, phone, role } = input;

  // Check if email already exists 
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new Error("Email already registered");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user (NO lowercase conversion)
  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, phone, role`,
    [name, email, hashedPassword, phone, role]
  );

  return result.rows[0];
};

const loginUser = async (input: LoginInput) => {
  const { email, password } = input;

  // check if user exists 
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = result.rows[0];

  // compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // Create JWT
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwtSecret as string,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
};

export { registerUser, loginUser };