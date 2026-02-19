import { Router } from "express";
import { usersController } from "./controller/users.controller.js";
import { verifyJWT } from "../../middleware/auth/verifiy-jwt.js";

const router = Router();

// Permiso: MOD_USERS
// Rutas específicas (sin parámetros) - deben ir primero
router.get("/", verifyJWT, usersController.list);
router.post("/", verifyJWT, usersController.create);
router.patch("/change-password", verifyJWT, usersController.changeMyPassword);
router.patch('/update-profile', verifyJWT, usersController.updateProfile);

// Rutas parametrizadas - deben ir al final
router.put("/:id", verifyJWT, usersController.update);
router.patch("/:id/status", verifyJWT, usersController.changeStatus);
router.patch("/:id/password", verifyJWT, usersController.changePassword);

export default router;
