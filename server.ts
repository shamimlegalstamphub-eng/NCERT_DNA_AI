import express from "express";
import path from "path";
import fs from "node:fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { connectDatabase } from "./server/config/db";
import apiRouter from "./server/routes/api";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.get('/google0ee9e93d33e16250.html',(req,res)=>{
    console.log('[VERIFICATION ROUTE CALLED] Request path:', req.path);
    res.status(200)
    res.setHeader('Content-Type','text/plain')
    return res.end(
      'google-site-verification: google0ee9e93d33e16250.html'
    )
  })

  // Serve static files from the 'public' directory directly at the root to ensure Google Search Console can find files in it
  app.use(express.static(path.join(process.cwd(), "public")));

  // 1. Establish database connection (MongoDB Atlas with local JSON failover fallback)
  console.log("⚡ Bootstrapping NCERT DNA AI persistent storage engine...");
  await connectDatabase();

  // 2. Request Logging Middleware for System Diagnostics
  app.use((req, res, next) => {
    const logPath = path.join(process.cwd(), "diagnostics.log");
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] REQ: ${req.method} ${req.url}\n`;
    try {
      fs.appendFileSync(logPath, entry, "utf8");
    } catch (e) {
      // Ignore write errors in readonly layers
    }
    next();
  });

  app.use(express.json({ limit: "25mb" }));

  // 3. Client Diagnostics Endpoint
  app.post("/api/diagnostics/log", (req, res) => {
    const logPath = path.join(process.cwd(), "diagnostics.log");
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] CLIENT_DIAG: ${JSON.stringify(req.body)}\n`;
    try {
      fs.appendFileSync(logPath, entry, "utf8");
    } catch (e) {
      // Ignore
    }
    console.log("[DIAGNOSTICS RECEIVED]", req.body);
    res.json({ ok: true });
  });

  // 4. Mount Centralized Router (Handling Auth, Profile, Notes, Bookmarks, Finder, Vision OCR, PYQs, Analytics, Revision)
  app.use("/api", apiRouter);

  // Serve Google Search Console verification file explicitly to bypass SPA fallback
  // (Handled at the top level for early matching, but we leave this comment to document the behavior)

  // 5. Serve static assets in development or production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      // Explicitly guard and bypass the SPA fallback for the Google Search Console verification file
      if (req.path === "/google0ee9e93d33e16250.html" || req.path.includes("google0ee9e93d33e16250")) {
        res.type("text/plain");
        return res.send("google-site-verification: google0ee9e93d33e16250.html");
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 NCERT DNA AI full-stack backend running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("❌ Critical server startup failure:", error);
});
