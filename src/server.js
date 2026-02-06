import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import cartRoutes from "./routes/cartroutes.js";
import favoriteroutes from "./routes/favouriteroutes.js";
import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();
connectDB();

const app = express();

// ✅ CORS (Frontend Vite URL)
app.use(
  cors({
    origin:["http://localhost:5173", "http://localhost:5174","https://elara-delta.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ✅ ROUTES
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/favorites", favoriteroutes);

app.get("/", (req, res) => {
  res.send("✅ ELARA Backend Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`✅ ELARA server running on port ${PORT}`));
import path from "path";

const __dirname = path.resolve();

// serve frontend build
app.use(express.static(path.join(__dirname, "frontend/dist")));

// always return index.html for react routes
app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
);
