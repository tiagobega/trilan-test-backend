import database from './../../config/prisma';
import hashToken from './../../config/crypto';

// used when we create a refresh token.
export function addRefreshTokenToWhitelist(
  id: string,
  refreshToken: string,
  userId: string
) {
  return database.refreshToken.create({
    data: {
      id,
      hashedToken: hashToken(refreshToken),
      userId,
    },
  });
}

// used to check if the token sent by the client is in the database.
export function findRefreshTokenById(id: string) {
  return database.refreshToken.findUnique({
    where: {
      id,
    },
  });
}

// soft delete tokens after usage.
export function deleteRefreshToken(id: string) {
  return database.refreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true,
    },
  });
}

export function revokeTokens(userId: string) {
  return database.refreshToken.updateMany({
    where: {
      userId,
    },
    data: {
      revoked: true,
    },
  });
}
