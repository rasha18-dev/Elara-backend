import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

// 🔴 THIS LINE IS MANDATORY
app.use("/api/orders", orderRoutes);

// (other routes)
app.use("/api/users", userRoutes);

app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`ELARA server running on port ${PORT}`)
);
