import User from "../models/userModel.js";

// ADD TO CART
export const addToCart = async (req, res) => {
  const { productId, qty } = req.body;

  const user = await User.findById(req.user._id);

  const exist = user.cart.find(
    (x) => x.productId.toString() === productId
  );

  if (exist) {
    exist.qty += qty;
  } else {
    user.cart.push({ productId, qty });
  }

  await user.save();

  const updated = await User.findById(req.user._id).populate("cart.productId");

  res.json(updated.cart);
};

// GET CART
export const getCart = async (req, res) => {
  const user = await User.findById(req.user._id).populate("cart.productId");
  res.json(user.cart || []);
};

// UPDATE QTY
export const updateCartQty = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    if (qty < 1) return res.status(400).json({ message: "Qty must be >= 1" });

    const user = await User.findById(req.user._id);

    const item = user.cart.find(
      (x) => x.productId.toString() === productId
    );

    if (!item) return res.status(404).json({ message: "Item not found" });

    // ✅ ONLY update qty (never auto delete)
    item.qty = qty;

    await user.save();

    res.json(user.cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Update qty failed" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const user = req.user._id;
    const productId = req.params.id;

    const userDoc = await User.findById(user);

    if (!userDoc) {
      return res.status(404).json({ message: "User not found" });
    }

    userDoc.cart = userDoc.cart.filter(
      (item) => item.productId.toString() !== productId
    );

    await userDoc.save();

    res.json(userDoc.cart);
  } catch (error) {
    console.log("REMOVE CART ERROR:", error);
    res.status(500).json({ message: "Remove failed" });
  }
};
