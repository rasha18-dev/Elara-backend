import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ REGISTER
router.post("/register", registerUser);

// ✅ LOGIN
router.post("/login", loginUser);

// ✅ FORGOT PASSWORD (OTP)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ✅ AFTER LOGIN PASSWORD CHANGE
router.put("/change-password", protect, changePassword);

export default router;
