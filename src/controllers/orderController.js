import Order from "../models/orderModel.js";
<<<<<<< HEAD
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
=======

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
>>>>>>> 4c3c48c046335d06bdc0ecb5c5447531e7d950e8
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
<<<<<<< HEAD
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
=======
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
>>>>>>> 4c3c48c046335d06bdc0ecb5c5447531e7d950e8
