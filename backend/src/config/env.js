import "dotenv/config";

/**
 * Centralized, validated environment configuration.
 * Fails fast at boot if required variables are missing, instead of
 * silently starting and only erroring on the first request.
 */

const nodeEnv = process.env.NODE_ENV || "development";
const isProdEnv = nodeEnv === "production";

const required = (key) => {
  const value = process.env[key];
  if (!value || value.trim() === "") {
    console.error(
      `\n❌ Missing required environment variable: ${key}\n` +
        `   Create a .env file in /backend (see .env.example) and set it.\n`
    );
    process.exit(1);
  }
  return value;
};

// In production the JWT secret must be set; in dev we fall back to a
// clearly-insecure default so `npm run dev` works out of the box.
const jwtSecret = isProdEnv
  ? required("JWT_SECRET")
  : process.env.JWT_SECRET || "dev-only-insecure-secret-change-me";

if (!isProdEnv && !process.env.JWT_SECRET) {
  console.warn("⚠️  JWT_SECRET not set — using an insecure dev default. Set it before production.");
}

export const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv,
  aiApiKey: required("AI_API_KEY"),
  // gemini-2.5-flash is much faster/cheaper than pro and is plenty for this task.
  aiModel: process.env.AI_MODEL || "gemini-2.5-flash",
  // Comma-separated list of allowed frontend origins. "*" allows all (dev only).
  corsOrigins: (process.env.CORS_ORIGINS || "*")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  // SQLite database file location.
  dbPath: process.env.DB_PATH || "./data/mediscan.db",
};

export const isProd = isProdEnv;
