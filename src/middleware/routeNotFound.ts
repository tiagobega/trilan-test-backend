import { Request, Response, NextFunction } from 'express';
import { ERROR_TYPE, NotFound } from '../constants/Errors';

export function routeNotFound(req: Request, res: Response, next: NextFunction) {
  const error = new NotFound([
    {
      code: ERROR_TYPE.NOT_FOUND_DATA,
      message: 'Route Not Found',
    },
  ]);

  res.status(error.httpStatus).json({ errors: error.issues });
}
