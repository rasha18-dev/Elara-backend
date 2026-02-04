// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     // Debug: check if URI is loaded
//     console.log("MONGO_URI:", process.env.MONGO_URI);

//     if (!process.env.MONGO_URI) {
//       throw new Error("MONGO_URI is undefined. Check your .env file.");
//     }

//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log("✅ MongoDB Atlas connected successfully");
//   } catch (error) {
//     console.error("❌ MongoDB connection error:", error.message);
//     process.exit(1);
//   }
// };

// export default connectDB;

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("MONGO_URI:", process.env.MONGO_URI);

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      family: 4, // force IPv4 (important for your network)
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB FULL ERROR:", error);
    process.exit(1);
  }
};

export default connectDB;
