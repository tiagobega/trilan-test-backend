import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ERROR_TYPE, HttpError, Unauthorized } from '../constants/Errors';
import { refreshTokenPayloadSchema } from '../constants/schemas';

export function auth(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  try {
    if (!authorization) {
      throw new Unauthorized([
        {
          code: ERROR_TYPE.AUTH,
          message: 'authorization header missing',
        },
      ]);
    }
    const [scheme, token] = authorization.split(' ');

    if (!/^Bearer$/i.test(scheme)) {
      throw new Unauthorized([
        {
          code: ERROR_TYPE.AUTH,
          message: 'authorization scheme should be Bearer',
        },
      ]);
    }

    if (!process.env.JWT_ACCESS_SECRET) {
      throw new Error('Please define JWT_ACCESS_SECRET in .env file');
    }

    const payload = refreshTokenPayloadSchema.parse(
      jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    );

    req.body.auth = payload;
    return next();
  } catch (err) {
    if (err instanceof HttpError) {
      return res.status(err.httpStatus).json({ errors: err.issues });
    }

    const error = new Unauthorized([
      {
        code: ERROR_TYPE.AUTH,
        message: `Invalid token: ${err}`,
      },
    ]);
    return res.status(error.httpStatus).json({ errors: error.issues });
  }
}
