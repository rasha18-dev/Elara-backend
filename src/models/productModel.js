import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    price: { type: Number, required: true },

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
const Product = mongoose.model("Product", productSchema);
export default Product;
