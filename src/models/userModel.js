import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String, required: true },

    isAdmin: { type: Boolean, default: false },
        // ✅ ADD THIS CART FIELD
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        qty: {
          type: Number,
          default: 1,
        },
      },
    ],
   
    favorites: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product"
  }
]
,
    // ✅ OTP reset fields (optional)
    otp: { type: String },
    otpExpire: { type: Date },
  },
  { timestamps: true }
);

// ✅ Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ✅ Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
