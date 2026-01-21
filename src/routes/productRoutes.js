import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
<<<<<<< HEAD
   updateProduct,
  deleteProduct,

=======
>>>>>>> 4c3c48c046335d06bdc0ecb5c5447531e7d950e8
} from "../controllers/productController.js";

import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", protect, admin, createProduct);
<<<<<<< HEAD
router.put("/:id", protect, admin, updateProduct);      
router.delete("/:id", protect, admin, deleteProduct);
=======
>>>>>>> 4c3c48c046335d06bdc0ecb5c5447531e7d950e8

export default router;
