import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import quizRouter from "./routes/quiz.js";
import { setGlobalDispatcher, Agent } from "undici";

setGlobalDispatcher(
  new Agent({
    connect: { timeout: 180_000 },
    headersTimeout: 180_000,
    bodyTimeout: 180_000,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.join(__dirname, "../frontend/dist");

const app = express();
const PORT = process.env.PORT || 5050;
app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || true,
  })
);
app.use(express.json({ limit: "50mb" }));

// API endpoints
app.use("/api", quizRouter);

// Serve production frontend assets
app.use(express.static(frontendDist));

// SPA fallback for non-API client-side routes
app.get("*", (req, res) => {
  const indexHtml = path.join(frontendDist, "index.html");
  res.sendFile(indexHtml, (err) => {
    if (err) {
      res.status(200).send("MILC Skin Lab backend is running. Please build the frontend with `npm run build`.");
    }
  });
});

app.listen(PORT, () => {
  console.log(`MILC backend running on http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log(`Model: ${process.env.GEMINI_MODEL || "gemini-2.5-flash"}`);
  console.log(`API key loaded: ${process.env.GEMINI_API_KEY ? "yes" : "NO — demo analysis will be used"}`);
});
