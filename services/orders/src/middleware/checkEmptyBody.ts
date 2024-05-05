import { Request, Response, NextFunction } from 'express';
import { ErrorHandler } from '../helpers/utils/errorHandlers.js';

export const checkEmptyBody = (req: Request, res: Response, next: NextFunction) => {

    if (req.method === 'GET') {
      return next();
    }

    if (Object.keys(req.body).length === 0) {
      throw new ErrorHandler(400, 'Request body cannot be empty.');
    }
  
    next();
  };