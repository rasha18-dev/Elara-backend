import express from "express";
import { addToCart, getCart, updateCartQty,removeFromCart  } from "../controllers/cartcontroller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addToCart);
router.get("/", protect, getCart);

// ✅ ADD THIS
router.put("/", protect, updateCartQty);
router.delete("/:id", protect, removeFromCart); 
export default router;
