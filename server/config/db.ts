import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let isConnected = false;

export async function connectDatabase() {
  if (isConnected) {
    return true;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes("<username>")) {
    console.warn("⚠️ MONGODB_URI not found or is placeholder. System running in hybrid local/in-memory database failover mode.");
    return false;
  }

  try {
    // Set mongoose connection options
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log("🚀 MongoDB Atlas successfully connected with standard connection pool.");
    return true;
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB Atlas database:", error);
    console.warn("⚠️ System falling back to local file-based mock simulation to preserve development preview uptime.");
    return false;
  }
}

export function getDatabaseStatus() {
  return {
    connected: isConnected,
    connectionState: mongoose.connection.readyState,
    host: mongoose.connection.host || "Local Sandbox Failover",
    name: mongoose.connection.name || "ncert_dna_fallback"
  };
}
