import { Request, Response, NextFunction } from "express";

export const canUpdateUser = (req: Request, res: Response, next: NextFunction) => {
  const loggedInUser = req.user; 
  const targetUserId = parseInt(req.params.userId as string);

  if (!loggedInUser) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  // Admin can update any user
  if (loggedInUser.role === "admin") {
    return next();
  }

  // Customer can update only their own profile
  if (loggedInUser.id === targetUserId) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "You are not allowed to update this user",
  });
};
