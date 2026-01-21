import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
<<<<<<< HEAD
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        image: { type: String },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
      },
    ],

    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },

    paymentMethod: {
      type: String,
      default: "COD",
    },

    totalPrice: { type: Number, required: true },

    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },

    // ✅ ADD THIS
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
=======
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // ✅ CUSTOMIZATION DETAILS
    customization: {
      size: String,
      material: String,
      engravingText: String,
      notes: String,
    },

    quantity: {
      type: Number,
      default: 1,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered"],
      default: "pending",
    },
>>>>>>> 4c3c48c046335d06bdc0ecb5c5447531e7d950e8
  },
  { timestamps: true }
);

<<<<<<< HEAD
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
=======
const Order = mongoose.model("Order", orderSchema);
>>>>>>> 4c3c48c046335d06bdc0ecb5c5447531e7d950e8
export default Order;
