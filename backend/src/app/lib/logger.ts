import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Custom format for console (dev-friendly)
const consoleFormat = printf(
  ({ level, message, timestamp, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length
      ? `\n${JSON.stringify(meta, null, 2)}`
      : "";
    return `[${timestamp}] ${level}: ${stack || message}${metaStr}`;
  },
);

// Shared transports
const transports: winston.transport[] = [];

// ── Console (always on) ──────────────────────────────────────────
transports.push(
  new winston.transports.Console({
    format: combine(
      colorize({ all: true }),
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      errors({ stack: true }),
      consoleFormat,
    ),
    silent: process.env.NODE_ENV === "test",
  }),
);

// ── File transports (production only) ───────────────────────────
if (process.env.NODE_ENV === "production") {
  // All logs
  transports.push(
    new DailyRotateFile({
      dirname: path.join(process.cwd(), "logs"),
      filename: "combined-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d", // keep 14 days
      format: combine(timestamp(), errors({ stack: true }), json()),
    }),
  );

  // Errors only
  transports.push(
    new DailyRotateFile({
      dirname: path.join(process.cwd(), "logs"),
      filename: "error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      level: "error",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d", // keep errors longer
      format: combine(timestamp(), errors({ stack: true }), json()),
    }),
  );
}

const logger = winston.createLogger({
  level:
    process.env.LOG_LEVEL ||
    (process.env.NODE_ENV === "production" ? "warn" : "debug"),
  transports,
  // Don't crash on unhandled promise rejections
  exitOnError: false,
});

export default logger;
