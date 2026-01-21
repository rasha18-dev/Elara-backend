import express from "express";
<<<<<<< HEAD
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";
=======
import { registerUser, loginUser } from "../controllers/userController.js";
>>>>>>> 4c3c48c046335d06bdc0ecb5c5447531e7d950e8

const router = express.Router();

// REGISTER
router.post("/register", registerUser);

// LOGIN
router.post("/login", loginUser);

<<<<<<< HEAD
// FORGOT PASSWORD (OTP)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ✅ AFTER LOGIN PASSWORD CHANGE
router.put("/change-password", protect, changePassword);

=======
>>>>>>> 4c3c48c046335d06bdc0ecb5c5447531e7d950e8
export default router;
