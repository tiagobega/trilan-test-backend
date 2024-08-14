import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';

export function generateAccessToken(user: User) {
  if (!process.env.JWT_ACCESS_SECRET) {
    throw new Error('Please define JWT_ACCESS_SECRET in .env file');
  }

  // I'll keep the access token valid for a long time because I'm using a free vercel database
  return jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: 168, // 7 days
  });
}

export function generateRefreshToken(user: User, jwtId: string) {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error('Please define JWT_REFRESH_SECRET in .env file');
  }

  return jwt.sign(
    {
      userId: user.id,
      jwtId,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: 168, // 7 days
    }
  );
}

export function generateTokens(user: User, jwtId: string) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, jwtId);

  return {
    accessToken,
    refreshToken,
  };
}
