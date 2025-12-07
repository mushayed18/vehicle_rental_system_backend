import { Request, Response } from "express";
import { getAllUsersService } from "./user.service";

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

export { getAllUsers };
