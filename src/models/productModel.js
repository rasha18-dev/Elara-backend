import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
    },

    image: {
      type: String,
    },
  },
  { timestamps: true }
);

// 🔴 MODEL NAME MUST BE "Product"
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
