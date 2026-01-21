import mongoose from "mongoose";
import bcrypt from "bcryptjs";

<<<<<<< HEAD
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    isAdmin: { type: Boolean, default: false },

    // 🔐 OTP LOGIN / RESET FIELDS
    otp: { type: String },
    otpExpire: { type: Date },
  },
  { timestamps: true }
);

// 🔒 Hash password before save
=======
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
});

>>>>>>> 4c3c48c046335d06bdc0ecb5c5447531e7d950e8
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

<<<<<<< HEAD
// 🔑 Match password (for normal login, if used)
=======
>>>>>>> 4c3c48c046335d06bdc0ecb5c5447531e7d950e8
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

<<<<<<< HEAD
export default mongoose.model("User", userSchema);
=======
export default mongoose.models.User ||
  mongoose.model("User", userSchema);
>>>>>>> 4c3c48c046335d06bdc0ecb5c5447531e7d950e8
