import { Request, Response } from "express";
import { getAllUsersService } from "./user.service";
import { updateUserService, isEmailTaken, deleteUserService } from "./user.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersService();

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });

  } catch (error) {
    console.error("Error retrieving users:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while retrieving users",
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const { name, email, phone, role } = req.body;

    if (
      name === undefined ||
      email === undefined ||
      phone === undefined ||
      role === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, phone, role) are required",
      });
    }

    // Email must be lowercase
    if (email !== String(email).toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: "Email must be in lowercase",
      });
    }

    // Validate role value
    if (role !== "admin" && role !== "customer") {
      return res.status(400).json({
        success: false,
        message: "Role must be either 'admin' or 'customer'",
      });
    }

    const loggedInUser = req.user!;
    if (loggedInUser.role !== "admin" && role !== loggedInUser.role) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to change your role",
      });
    }

    // Check email uniqueness (exclude this user)
    const taken = await isEmailTaken(email, userId);
    if (taken) {
      return res.status(400).json({
        success: false,
        message: "Email already in use by another user",
      });
    }

    const updatePayload = {
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      role: role as "admin" | "customer",
    };

    const updated = await updateUserService(userId, updatePayload);

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updated,
    });
  } catch (err: any) {
    if (err.message === "User not found") {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    console.error("updateUser error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update user",
    });
  }
};


const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    await deleteUserService(userId);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    if (error.message === "User not found") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (error.message.includes("active bookings")) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete user with active bookings",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the user",
    });
  }
};

export { getAllUsers, updateUser, deleteUser };