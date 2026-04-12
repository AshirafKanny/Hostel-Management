import mongoose from "mongoose";
import User from "./models/user.js";
import dotenv from "dotenv";

dotenv.config();

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Update user to admin
    const email = "ashirafkanny04@gmail.Com"; // Your email
    const result = await User.updateOne(
      { email: email },
      { $set: { isAdmin: true } }
    );

    if (result.modifiedCount > 0) {
      console.log(`✅ User ${email} is now an admin!`);
    } else {
      console.log(`⚠️  User ${email} not found or already admin`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

makeAdmin();
