import express from "express";
const router = express.Router();

import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  markOrderDelivered,
} from "../controllers/orderController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

// ✅ CREATE ORDER (Customer)
router.post("/", protect, createOrder);

// ✅ MY ORDERS (Customer)
router.get("/my", protect, getMyOrders);

// ✅ ADMIN GET ALL ORDERS
router.get("/", protect, admin, getAllOrders);

// ✅ GET SINGLE ORDER (User/Admin)
router.get("/:id", protect, getOrderById);

// ✅ ADMIN MARK DELIVERED
router.put("/:id/deliver", protect, admin, markOrderDelivered);

export default router;
