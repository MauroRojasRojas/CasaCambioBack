import { Router } from "express";
import { verifyJWT } from "../../../middleware/auth/verifiy-jwt.js";
import { getPresigned } from "../controllers/uploads.controller.js";

const router = Router();

router.post("/presigned", verifyJWT, getPresigned);

export default router;
