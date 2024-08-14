import z from 'zod';

export const registerUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export const refreshTokenPayloadSchema = z.object({
  userId: z.string(),
  jwtId: z.string(),
});

export const refreshTokenRevokeSchema = z.object({
  userId: z.string(),
});
