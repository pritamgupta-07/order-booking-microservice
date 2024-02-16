import { Logger, createLogger, format, transports } from "winston";
const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp, metadata }) => {
  return `${timestamp} [${
    metadata?.label ? metadata?.label : "SERVER"
  }] ${level}: ${message} ${metadata?.stack ? metadata?.stack : ''}`;
});

const devLogger: Logger = createLogger({
  level: "info",
  defaultMeta: { service: "Seller Service" },
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
  transports: [new transports.Console()],
});

export default devLogger;
