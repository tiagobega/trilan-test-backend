import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

import { generateTokens } from '../../config/jwt';
import {
  AuthError,
  BadRequest,
  ERROR_TYPE,
  Unauthorized,
} from '../../constants/Errors';

import {
  loginUserSchema,
  refreshTokenPayloadSchema,
  refreshTokenRevokeSchema,
  refreshTokenSchema,
  registerUserSchema,
} from '../../constants/schemas';
import { Controller } from '../../decorators/controller';
import { Route } from '../../decorators/route';
import { createUser, findUserByEmail, findUserById } from '../user/services';
import {
  addRefreshTokenToWhitelist,
  deleteRefreshToken,
  findRefreshTokenById,
  revokeTokens,
} from './services';
import hashToken from '../../config/crypto';

@Controller('/auth')
export default class AuthController {
  @Route('post', '/login')
  async login(req: Request, res: Response, next: NextFunction) {
    const error = new AuthError([
      {
        code: ERROR_TYPE.AUTH,
        message: 'Invalid login credentials.',
      },
    ]);

    try {
      const { email, password } = loginUserSchema.parse(req.body);

      const existingUser = await findUserByEmail(email);

      if (!existingUser) {
        throw error;
      }

      const validPassword = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!validPassword) {
        throw error;
      }

      const jwtId = uuidv4();
      const { accessToken, refreshToken } = generateTokens(existingUser, jwtId);

      await addRefreshTokenToWhitelist(jwtId, refreshToken, existingUser.id);

      res.json({
        accessToken,
        refreshToken,
      });
    } catch (err) {
      next(err);
    }
  }

  @Route('post', '/register')
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = registerUserSchema.parse(req.body);

      const existingUser = await findUserByEmail(email);

      if (existingUser) {
        const error = new BadRequest([
          {
            code: ERROR_TYPE.USER_TAKEN,
            message: `This email is ${email} already taken.`,
          },
        ]);
        throw error;
      }

      const user = await createUser(name, email, password);

      const jwtId = uuidv4();

      const { accessToken, refreshToken } = generateTokens(user, jwtId);

      await addRefreshTokenToWhitelist(jwtId, refreshToken, user.id);

      res.json({
        accessToken,
        refreshToken,
      });
    } catch (err) {
      next(err);
    }
  }

  @Route('post', '/refreshToken')
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = refreshTokenSchema.parse(req.body);

      if (!process.env.JWT_REFRESH_SECRET) {
        throw new Error('Please define JWT_REFRESH_SECRET in .env file.');
      }

      const payload = refreshTokenPayloadSchema.parse(
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
      );

      const savedRefreshToken = await findRefreshTokenById(payload.jwtId);

      if (!savedRefreshToken || savedRefreshToken.revoked === true) {
        throw new Unauthorized([
          {
            code: ERROR_TYPE.REFRESH_TOKEN,
            path: ['savedRefreshToken', 'revoked'],
            received: [
              String(savedRefreshToken),
              String(savedRefreshToken?.revoked),
            ],
            message: 'Refresh token not found or revoked',
          },
        ]);
      }

      const hashedToken = hashToken(refreshToken);
      if (hashedToken !== savedRefreshToken.hashedToken) {
        throw new Unauthorized([
          {
            code: ERROR_TYPE.REFRESH_TOKEN,
            message: 'RefreshToken hash is different from saved token hash',
          },
        ]);
      }

      const user = await findUserById(payload.userId);
      if (!user) {
        throw new Unauthorized([
          {
            code: ERROR_TYPE.NOT_FOUND_DATA,
            message: 'User was not founded',
          },
        ]);
      }

      await deleteRefreshToken(savedRefreshToken.id);

      const jwtId = uuidv4();
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(
        user,
        jwtId
      );

      await addRefreshTokenToWhitelist(jwtId, newRefreshToken, user.id);

      res.json({
        accessToken,
        refreshToken: newRefreshToken,
      });
    } catch (err) {
      next(err);
    }
  }

  @Route('post', '/revokeRefreshTokens')
  async revokeRefreshTokens(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = refreshTokenRevokeSchema.parse(req.body);
      await revokeTokens(userId);
      res.json({ message: `Tokens revoked for user with id #${userId}` });
    } catch (err) {
      next(err);
    }
  }
}
