import express from "express";
<<<<<<< HEAD
const router = express.Router();

=======
>>>>>>> 4c3c48c046335d06bdc0ecb5c5447531e7d950e8
import {
  createOrder,
  getMyOrders,
  getAllOrders,
<<<<<<< HEAD
  getOrderById,
  markOrderDelivered,
} from "../controllers/orderController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

// ✅ CREATE ORDER
router.post("/", protect, createOrder);

// ✅ MY ORDERS
router.get("/my", protect, getMyOrders);

// ✅ ADMIN GET ALL ORDERS
router.get("/", protect, admin, getAllOrders);

// ✅ GET SINGLE ORDER
router.get("/:id", protect, getOrderById);

// ✅ ADMIN MARK DELIVERED
router.put("/:id/deliver", protect, admin, markOrderDelivered);
=======
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
>>>>>>> 4c3c48c046335d06bdc0ecb5c5447531e7d950e8

export default router;
