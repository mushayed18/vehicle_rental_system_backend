import { Router } from "express";
import { getAllUsers } from "./user.controller";
import { auth } from "../../middleware/auth.middleware";
import { adminOnly } from "../../middleware/admin.middleware";
import { canUpdateUser } from "../../middleware/userUpdatePermission.middleware";
import { updateUser, deleteUser } from "./user.controller";

const router = Router();

router.get("/", auth, adminOnly, getAllUsers);
router.put("/:userId", auth, canUpdateUser, updateUser);
router.delete("/:userId", auth, adminOnly, deleteUser);

export default router;
