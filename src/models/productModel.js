import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    price: { type: Number, required: true },
     weight: {
      type: String, // example: "500g", "1kg"
      required: true,
    },

    description: { type: String, default: "" },

    image: { type: String, required: true },

    // ✅ category for filtering
    category: {
      type: String,
      required: true,
      default: "Others",
    },

    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

// ✅ normal MERN export
const product = mongoose.model("product", productSchema);

export default product;
