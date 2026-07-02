/**
 * Tiny structured logger. Keeps output greppable and timestamped without
 * pulling in a heavy logging dependency.
 */
const line = (level, msg, meta) => {
  const ts = new Date().toISOString();
  const suffix = meta ? ` ${JSON.stringify(meta)}` : "";
  return `${ts} [${level}] ${msg}${suffix}`;
};

export const logger = {
  info: (msg, meta) => console.log(line("INFO", msg, meta)),
  warn: (msg, meta) => console.warn(line("WARN", msg, meta)),
  error: (msg, meta) => console.error(line("ERROR", msg, meta)),
};
