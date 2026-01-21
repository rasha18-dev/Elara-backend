import mongoose from "mongoose";

<<<<<<< HEAD


const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    price: { type: Number, required: true },

    description: { type: String },

    image: { type: String },

    // ✅ ADD THIS FOR FILTERING
    category: {
      type: String,
      required: true,
      default: "Others",
    },

    countInStock: { type: Number, required: true, default: 0 },

   
=======
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
>>>>>>> 4c3c48c046335d06bdc0ecb5c5447531e7d950e8
  },
  { timestamps: true }
);

<<<<<<< HEAD
=======
// 🔴 MODEL NAME MUST BE "Product"
>>>>>>> 4c3c48c046335d06bdc0ecb5c5447531e7d950e8
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
