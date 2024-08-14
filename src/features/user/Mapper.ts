import { User } from '@prisma/client';

export class UserMapper {
  static toPrisma(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      userName: user.userName,
    };
  }

  static toApi(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      userName: user.userName,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
