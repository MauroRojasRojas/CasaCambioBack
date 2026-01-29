import { Router } from "express";
import { verifyJWT } from "../../../middleware/auth/verifiy-jwt.js";
import { create, list, remove, rename } from "../controllers/files.controller.js";

const router = Router();

router.post("/", verifyJWT, create);
router.get("/:entidad/:idEntidad", verifyJWT, list);
router.get("/:idArchivo/", verifyJWT, list);
router.patch("/:idArchivo/delete", verifyJWT, remove);
router.patch("/:idArchivo/rename", verifyJWT, rename);

export default router;
