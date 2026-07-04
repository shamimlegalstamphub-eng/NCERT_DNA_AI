import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { DatabaseService } from "../services/db.service";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-for-ncert-dna-3122";

// Extend Express Request interface to include custom properties
export interface AuthenticatedRequest extends Request {
  userId?: string;
  email?: string;
  clearanceLevel?: string;
}

// Simple in-memory rate limiter to satisfy STEP 8 & STEP 4
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 150;

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.headers["x-forwarded-for"]?.toString() || "unknown-ip";
  const now = Date.now();
  
  const clientData = rateLimitMap.get(ip);
  if (!clientData) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return next();
  }

  if (now - clientData.lastReset > RATE_LIMIT_WINDOW_MS) {
    clientData.count = 1;
    clientData.lastReset = now;
    return next();
  }

  clientData.count += 1;
  if (clientData.count > MAX_REQUESTS_PER_MINUTE) {
    return res.status(429).json({
      status: "ERROR",
      message: "Rate limit exceeded. Too many requests. Please slow down and try again."
    });
  }

  next();
}

// Generate Auth and Refresh token payload
export function generateToken(payload: { userId: string; email: string; clearanceLevel: string }) {
  // Sign JWT with 30 days expiration (requested: Session timeout 30 days)
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
  const refreshToken = jwt.sign({ userId: payload.userId }, JWT_SECRET, { expiresIn: "90d" });
  return { token, refreshToken };
}

// Middleware to verify JWT token
export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token || token === "undefined" || token === "null") {
    return res.status(401).json({ status: "ERROR", message: "Authentication bearer token required." });
  }

  // Handle known bypass tokens for guest/offline preview mode gracefully
  if (
    token === "PUBLIC_GUEST_BYPASS" ||
    token === "SECURE_OFFLINE_BYPASS" ||
    token.startsWith("OFFLINE_") ||
    token.startsWith("GUEST_") ||
    token.startsWith("SECURE_")
  ) {
    const isGuest = token === "PUBLIC_GUEST_BYPASS" || token.startsWith("GUEST_") || token.includes("GUEST");
    req.userId = isGuest ? "GUEST_USER" : "OFFLINE_STUDENT";
    req.email = isGuest ? "guest_preview@ncertdna.ai" : "offline_student@ncertdna.ai";
    req.clearanceLevel = isGuest ? "GUEST_PREVIEW" : "STUDENT_PREVIEW";
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; clearanceLevel: string };
    
    // Check if session is still active in database/session index to satisfy STEP 2 and 4
    const validUserId = await DatabaseService.verifySession(token);
    if (!validUserId) {
      return res.status(401).json({ status: "ERROR", message: "Session expired or logged out." });
    }

    req.userId = decoded.userId;
    req.email = decoded.email;
    req.clearanceLevel = decoded.clearanceLevel;
    next();
  } catch (error) {
    console.error(`JWT Verification failed for token "${token}":`, error);
    return res.status(403).json({ status: "ERROR", message: "Invalid or expired authorization token." });
  }
}
