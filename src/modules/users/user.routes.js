import { Router } from "express";
import { usersController } from "./controller/users.controller.js";
import { verifyJWT } from "../../middleware/auth/verifiy-jwt.js";

const router = Router();

// Permiso: MOD_USERS
router.get("/", verifyJWT, usersController.list);
router.post("/", verifyJWT, usersController.create);
router.put("/:id", verifyJWT, usersController.update);
router.patch("/:id/status", usersController.changeStatus);
router.patch("/:id/password", usersController.changePassword);
router.patch("/change-password", usersController.changeMyPassword);
router.patch('/update-profile',  usersController.updateProfile);

export default router;
