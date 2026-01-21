import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
<<<<<<< HEAD
import bcrypt from "bcryptjs";
import sendEmail from "../utils/SendEmail.js";

/* ================= REGISTER ================= */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password, // ✅ plain password only
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
=======

/**
 * @desc    Register new user
 * @route   POST /api/users/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ❌ DO NOT hash password here
    // ✅ Model will hash automatically
    const user = await User.create({
      name,
      email,
      password, // plain password
      isAdmin: isAdmin || false,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      message: "User registered successfully",
>>>>>>> 4c3c48c046335d06bdc0ecb5c5447531e7d950e8
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

<<<<<<< HEAD
/* ================= LOGIN (PASSWORD) ================= */
export const loginUser = async (req, res) => {
  try {
    

    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password;

    

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });

    console.log("USER FOUND:", user);

=======
/**
 * @desc    Login user & get token
 * @route   POST /api/users/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
>>>>>>> 4c3c48c046335d06bdc0ecb5c5447531e7d950e8
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

<<<<<<< HEAD
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("PASSWORD MATCH:", isMatch);

=======
    // Compare password using model method
    const isMatch = await user.matchPassword(password);
>>>>>>> 4c3c48c046335d06bdc0ecb5c5447531e7d950e8
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

<<<<<<< HEAD
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,  isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

/* ================= CHANGE PASSWORD (AFTER LOGIN) ================= */
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // validation
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    // ✅ req.user comes from protect middleware
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // update password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
  
    res.status(500).json({ message: error.message });
  }
};


/* ================= SEND OTP (NO DB STORAGE) ================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create JWT containing OTP
    const otpToken = jwt.sign(
      { email, otp },
      process.env.JWT_SECRET,
      { expiresIn: "5m" }
    );

    // Send OTP Email
    await sendEmail(
      email,
      "Password Reset OTP",
      `
        <h2>Your OTP is ${otp}</h2>
        <p>Valid for 5 minutes</p>
      `
    );

    res.status(200).json({
      message: "OTP sent to email",
      otpToken, // frontend must store safely
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= RESET PASSWORD USING OTP ================= */
export const resetPassword = async (req, res) => {
  try {
    const { otp, otpToken, newPassword } = req.body;

    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

    if (decoded.otp !== otp.toString())
      return res.status(400).json({ message: "Invalid OTP" });

    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = newPassword; // ✅ plain password only (model will hash)
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(400).json({ message: "OTP expired or invalid" });
  }
};

/* ================= LOGIN USING OTP ================= */
export const Otpverify = async (req, res) => {
  try {
    const { otp, otpToken } = req.body;

    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

    if (decoded.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    const user = await User.findOne({ email: decoded.email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

=======
    // Generate JWT
>>>>>>> 4c3c48c046335d06bdc0ecb5c5447531e7d950e8
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
<<<<<<< HEAD
      message: "OTP login successful",
      token,
    });
  } catch (error) {
    res.status(400).json({ message: "OTP expired or invalid" });
=======
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
>>>>>>> 4c3c48c046335d06bdc0ecb5c5447531e7d950e8
  }
};
