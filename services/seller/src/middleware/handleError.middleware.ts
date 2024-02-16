import { NextFunction, Request, Response } from "express";
import logger from "../logger/index.js";
import { ErrorHandler } from "../helpers/utils/errorHandlers.js";

export const handleError = async function (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
    
  logger.error(error.message, { metadata: { stack: error.stack } });

  if (error.name === "ValidationError") {
    ErrorHandler.handleValidationError(res, error.message);
  }

  if (res.headersSent) {
    return;
  }

  ErrorHandler.handleServerError(res);
};
