import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// ✅ CREATE ORDER (COD)
export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress } = req.body;

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

    // ✅ total price calculation
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

    // ✅ Create order
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
    return res.status(500).json({ message: error.message });
  }
};

// ✅ GET MY ORDERS
export const getMyOrders = async (req, res) => {
  try {
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

    // ✅ user can see only their order (admin can see all)
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

// ✅ MARK ORDER DELIVERED (ADMIN)
export const markDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.isDelivered = true;
    order.deliveredAt = new Date();

    const updated = await order.save();

    return res.json({ message: "Order Delivered ✅", order: updated });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const markOrderDelivered = async (req, res) => {
  try {
    
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
   

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json({ message: "Order marked as delivered ✅", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};