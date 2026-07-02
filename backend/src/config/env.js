import "dotenv/config";

/**
 * Centralized, validated environment configuration.
 * Fails fast at boot if required variables are missing, instead of
 * silently starting and only erroring on the first request.
 */

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

export const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  aiApiKey: required("AI_API_KEY"),
  // gemini-2.5-flash is much faster/cheaper than pro and is plenty for this task.
  aiModel: process.env.AI_MODEL || "gemini-2.5-flash",
  // Comma-separated list of allowed frontend origins. "*" allows all (dev only).
  corsOrigins: (process.env.CORS_ORIGINS || "*")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
};

export const isProd = env.nodeEnv === "production";
