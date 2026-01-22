import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// ✅ CREATE ORDER (COD)
export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (
      !shippingAddress?.name ||
      !shippingAddress?.phone ||
      !shippingAddress?.address
    ) {
      return res.status(400).json({ message: "Shipping details required" });
    }

    // ✅ Total Price
    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    // ✅ Reduce stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if ((product.countInStock || 0) < item.qty) {
        return res.status(400).json({
          message: `Only ${product.countInStock} left for ${product.name}`,
        });
      }

      product.countInStock = (product.countInStock || 0) - item.qty;
      await product.save();
    }

    // ✅ Create Order
    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod: "COD",
      totalPrice,
      isPaid: false,
    });

    return res.status(201).json({
      message: "Order Confirmed ✅",
      order,
    });
  } catch (error) {
    console.log("ORDER CREATE ERROR:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

// ✅ GET MY ORDERS (Customer)
export const getMyOrders = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ✅ GET ALL ORDERS (ADMIN)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ✅ GET ORDER BY ID (User/Admin)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ User can see only their order, admin can see all
    if (
      !req.user.isAdmin &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    return res.json(order);
  } catch (error) {
    return res.status(400).json({ message: "Invalid order id" });
  }
};

// ✅ ADMIN MARK ORDER DELIVERED
export const markOrderDelivered = async (req, res) => {
  try {
    console.log("✅ DELIVER API HIT:", req.params.id);

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isDelivered = true;
    order.deliveredAt = new Date();

    const updatedOrder = await order.save();

    return res.json({
      message: "Order marked as delivered ✅",
      order: updatedOrder,
    });
  } catch (error) {
    console.log("DELIVER ERROR:", error.message);
    return res.status(500).json({ message: error.message });
  }
};
