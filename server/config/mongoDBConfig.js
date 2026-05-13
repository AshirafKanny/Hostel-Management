import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing. Create a .env file and set MONGO_URI before starting the server."
      );
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (error.message.includes("Could not connect to any servers")) {
      console.error(
        "MongoDB Atlas connection failed. If you are using Atlas, add your IP to the cluster network access list or switch to a local MongoDB URI."
      );
    }
    process.exit(1);
  }
};

export default connectDB;
