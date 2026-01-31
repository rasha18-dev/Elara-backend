import User from "../models/userModel.js";

export const addToCart = async (req, res) => {
  const { productId, qty } = req.body;

  const user = await User.findById(req.user.id);

  const item = user.cart.find(
    (i) => i.productId.toString() === productId
  );

  if (item) {
    item.qty += qty;
  } else {
    user.cart.push({ productId, qty });
  }

  await user.save();

  res.json(user.cart);
};

export const getCart = async (req, res) => {
  const user = await User.findById(req.user.id).populate("cart.productId");
  res.json(user.cart);
};
