import winston from "winston";

const lineFormat = winston.format.printf(({ timestamp, level, message }) => {
  return `${timestamp} ${level.toUpperCase()} ${message}`;
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.uncolorize(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    lineFormat,
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/combined.log" }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
  ],
});
