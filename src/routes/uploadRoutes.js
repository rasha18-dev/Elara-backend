import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import { uploadToCloudinary } from "../controllers/uploadController.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", protect, upload.single("image"), uploadToCloudinary);

export default router;
