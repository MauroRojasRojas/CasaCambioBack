import { Router } from "express";
import { usersController } from "./controller/users.controller.js";
import { verifyJWT } from "../../middleware/auth/verifiy-jwt.js";
import { requireAdmin } from "../../middleware/auth/requireAdmin.js";

const router = Router();

// Rutas de usuario propio (USER y ADMIN)
router.patch("/change-password", verifyJWT, usersController.changeMyPassword);
router.patch('/update-profile', verifyJWT, usersController.updateProfile);

// Rutas solo ADMIN
router.get("/", verifyJWT, requireAdmin, usersController.list);
router.post("/", verifyJWT, requireAdmin, usersController.create);
router.put("/:id", verifyJWT, requireAdmin, usersController.update);
router.patch("/:id/status", verifyJWT, requireAdmin, usersController.changeStatus);
router.patch("/:id/password", verifyJWT, requireAdmin, usersController.changePassword);

export default router;
