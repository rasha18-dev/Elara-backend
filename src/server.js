import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

<<<<<<< HEAD
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

=======
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();
>>>>>>> 4c3c48c046335d06bdc0ecb5c5447531e7d950e8
connectDB();

const app = express();

<<<<<<< HEAD
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
=======
app.use(express.json());

>>>>>>> 4c3c48c046335d06bdc0ecb5c5447531e7d950e8
// 🔴 THIS LINE IS MANDATORY
app.use("/api/orders", orderRoutes);

// (other routes)
app.use("/api/users", userRoutes);

app.use("/api/products", productRoutes);
<<<<<<< HEAD
app.use("/api/upload", uploadRoutes);
=======

>>>>>>> 4c3c48c046335d06bdc0ecb5c5447531e7d950e8
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`ELARA server running on port ${PORT}`)
);
