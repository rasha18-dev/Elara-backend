import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/SendEmail.js";

/* ================= REGISTER ================= */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const userExists = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ model will hash password
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      isAdmin: isAdmin || false,
    });

    return res.status(201).json({
      message: "User registered successfully ✅",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= LOGIN ================= */
export const loginUser = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ use model method if exists
    let isMatch = false;
    if (typeof user.matchPassword === "function") {
      isMatch = await user.matchPassword(password);
    } else {
      isMatch = await bcrypt.compare(password, user.password);
    }

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    return res.status(200).json({
      message: "Login successful ✅",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

/* ================= CHANGE PASSWORD (AFTER LOGIN) ================= */
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // ✅ set new password (model will hash if you have pre-save)
    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully ✅" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= FORGOT PASSWORD (SEND OTP) ================= */
export const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();

    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ JWT containing OTP
    const otpToken = jwt.sign({ email, otp }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });

    await sendEmail(
      email,
      "Password Reset OTP",
      `<h2>Your OTP is ${otp}</h2><p>Valid for 5 minutes</p>`
    );

    return res.status(200).json({
      message: "OTP sent to email ✅",
      otpToken,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= RESET PASSWORD USING OTP ================= */
export const resetPassword = async (req, res) => {
  try {
    const { otp, otpToken, newPassword } = req.body;

    if (!otp || !otpToken || !newPassword) {
      return res
        .status(400)
        .json({ message: "OTP, otpToken, and newPassword required" });
    }

    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

    if (decoded.otp !== otp.toString().trim()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = newPassword; // ✅ plain password, model hash
    await user.save();

    return res.json({ message: "Password reset successful ✅" });
  } catch (error) {
    return res.status(400).json({ message: "OTP expired or invalid" });
  }
};
