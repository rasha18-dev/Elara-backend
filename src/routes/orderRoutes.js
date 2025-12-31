import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

/**
 * CUSTOMER ROUTES
 */

// 👉 Create new order (customer)
router.post("/", protect, createOrder);

// 👉 Get logged-in user's orders
router.get("/my-orders", protect, getMyOrders);

/**
 * ADMIN ROUTES
 */
router.get("/", protect, admin, getAllOrders);

// 👉 Update order status (admin)
router.put("/:id", protect, admin, updateOrderStatus);

export default router;
