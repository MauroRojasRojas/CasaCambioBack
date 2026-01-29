import { Router } from "express";
import { login, verifyMe, completeProfile, refreshTokenController, resendOtp, verifyModulePermission, register, verifyEmail, logoutController, forgotPasswordController, resetPasswordController, validateResetTokenController } from "../controller/auth.controller.js";
import { verifyJWT } from "../../../middleware/auth/verifiy-jwt.js";
import { googleLoginController, googleRegisterController } from "../controller/google.controller.js";
const router = Router();

router.post("/login", login);

router.get("/me", verifyJWT, verifyMe);
router.get('/verify-permission', verifyJWT, verifyModulePermission);
router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.put("/complete-profile", completeProfile);
router.put("/resend-otp", resendOtp);
router.post("/refresh", refreshTokenController);
router.post("/login-google", googleLoginController);
router.post('/google', googleRegisterController);
router.post('/logout', logoutController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
router.post("/validate-reset-token", validateResetTokenController);

export default router;