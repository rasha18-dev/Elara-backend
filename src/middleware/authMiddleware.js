import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  let token;

<<<<<<< HEAD
  // ✅ Check Authorization header
=======
  // Check Authorization header
>>>>>>> 4c3c48c046335d06bdc0ecb5c5447531e7d950e8
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
<<<<<<< HEAD
      // ✅ Get token
      token = req.headers.authorization.split(" ")[1];

      // ✅ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ Attach user to req (important)
      req.user = await User.findById(decoded.id).select("-password");

      // If user not found
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      console.log("AUTH ERROR:", error.message);
=======
      // Get token
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (VERY IMPORTANT)
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
>>>>>>> 4c3c48c046335d06bdc0ecb5c5447531e7d950e8
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
<<<<<<< HEAD

// ✅ ADMIN middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: "Admin only! Not authorized" });
  }
};
=======
>>>>>>> 4c3c48c046335d06bdc0ecb5c5447531e7d950e8
