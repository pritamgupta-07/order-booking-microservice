import { Logger, createLogger, format, transports } from "winston";
const { json } = format;

const productionLogger: Logger = createLogger({
  level: "info",
  defaultMeta: { service: "Seller Service" },
  format: json(),
  transports: [
    new transports.File({ filename: "log/error.log", level: "error" }),
    new transports.File({ filename: "log/combined.log" }),
  ],
});

export default productionLogger;
