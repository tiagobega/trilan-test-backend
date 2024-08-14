import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { HttpError } from '../constants/Errors';

export const errorHandler = (error: Error, req: Request, res: Response) => {
  if (error instanceof ZodError) {
    return res.status(400).json({ errors: error.issues });
  }

  if (error instanceof HttpError) {
    return res.status(error.httpStatus).json({ errors: error.issues });
  }
};
