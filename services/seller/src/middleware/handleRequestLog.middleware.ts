import { NextFunction, Request, Response } from "express";
import logger from "../logger/index.js";

export const handleRequestLog = (req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.url}`, { metadata: { label: req.method } });
    next();
  }