import express from "express";
import cors from "cors";
import { env } from "./src/config/env.js";
import { logger } from "./src/utils/logger.js";
import reportRoutes from "./src/routes/reportRoutes.js";
import { notFound, errorHandler } from "./src/middleware/errorHandler.js";

const app = express();

// CORS: restrict to configured origins in production, allow all in dev.
const corsOptions = env.corsOrigins.includes("*")
  ? {}
  : { origin: env.corsOrigins };
app.use(cors(corsOptions));

app.use(express.json({ limit: "1mb" }));

// Health check for load balancers / uptime monitors.
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime(), env: env.nodeEnv });
});

app.use("/api/reports", reportRoutes);

// 404 + centralized error handling (must be last).
app.use(notFound);
app.use(errorHandler);

app.listen(env.port, () => {
  logger.info(`Server running at http://localhost:${env.port}`, { env: env.nodeEnv });
});
