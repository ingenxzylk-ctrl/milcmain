import "dotenv/config";
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

const app = express();
const PORT = process.env.PORT || 5000;
app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use("/api", quizRouter);

app.listen(PORT, () => {
  console.log(`MILC backend running on http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log(`Model: ${process.env.GEMINI_MODEL || "gemini-2.5-flash"}`);
  console.log(`API key loaded: ${process.env.GEMINI_API_KEY ? "yes" : "NO — demo analysis will be used"}`);
});
