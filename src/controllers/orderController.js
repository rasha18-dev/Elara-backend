import Order from "../models/orderModel.js";

/**
 * @desc    Create new order (customer)
 * @route   POST /api/orders
 * @access  Private
 */
export const createOrder = async (req, res) => {
  try {
    // 🔴 VERY IMPORTANT: check auth
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { product, quantity, customization, totalPrice } = req.body;

    // Basic validation
    if (!product || !totalPrice) {
      return res.status(400).json({
        message: "Product and totalPrice are required",
      });
    }

    // Create order object
    const order = new Order({
      user: req.user._id,     // from protect middleware
      product,
      quantity: quantity || 1,
      customization: customization || {},
      totalPrice,
    });

    // 🔴 THIS LINE SAVES TO MONGODB
    const savedOrder = await order.save();

    // Debug (optional – keep while testing)
    console.log("ORDER SAVED:", savedOrder);

    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("ORDER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get logged-in user's orders
 * @route   GET /api/orders/my-orders
 * @access  Private
 */
export const getMyOrders = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const orders = await Order.find({ user: req.user._id })
      .populate("product", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Admin - get all orders
 * @route   GET /api/orders
 * @access  Admin
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("product", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Admin - update order status
 * @route   PUT /api/orders/:id
 * @access  Admin
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = req.body.status || order.status;

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
