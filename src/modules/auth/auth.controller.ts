import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service";

const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (email !== String(email).toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: "Email must be in lowercase",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const user = await registerUser({ name, email, password, phone, role });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

const signin = async (req: Request, res: Response) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (email !== email.toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: "Email must be lowercase",
      });
    }

    const data = await loginUser({ email, password });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

export { signup, signin };