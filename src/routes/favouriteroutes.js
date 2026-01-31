import express from "express";
import User from "../models/userModel.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ADD FAVORITE */
router.post("/:productId", protect, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user.favorites.includes(req.params.productId)) {
    user.favorites.push(req.params.productId);
    await user.save();
  }

  const updatedUser = await User.findById(req.user._id).populate("favorites");

  res.json(updatedUser.favorites);
});

/* GET FAVORITES */
router.get("/", protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate("favorites");
  res.json(user.favorites);
});

export default router;
