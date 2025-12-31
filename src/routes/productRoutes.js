import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
} from "../controllers/productController.js";

import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", protect, admin, createProduct);

export default router;
