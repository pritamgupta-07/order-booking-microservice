import { Response } from "express";

export class ErrorHandler {
    static sendError(res: Response, statusCode: number, message: string) {
      res.status(statusCode).json({ error: { message } });
    }
  
    static handleValidationError(res: Response, errors: string) {
      res.status(400).json({ error: { message: 'Validation failed', errors } });
    }
  
    static handleServerError(res: Response) {

      res.status(500).json({ error: { message: 'Internal server error' } });
    }
  }