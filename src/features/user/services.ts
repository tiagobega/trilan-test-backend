import bcrypt from 'bcrypt';
import database from '../../config/prisma';
import { User } from '@prisma/client';

export function createUser(name: string, email: string, password: string) {
  const hashPassword = bcrypt.hashSync(password, 12);
  return database.user.create({
    data: {
      name,
      email,
      password: hashPassword,
      userName: name,
    },
  });
}

export function updateUser(user: User, data: Partial<User>) {
  const {
    email = user.email,
    name = user.name,
    userName = user.userName,
  } = data;

  return database.user.update({
    where: {
      id: user.id,
    },
    data: {
      email,
      name,
      userName,
    },
  });
}

export function findUserById(id: string) {
  return database.user.findUnique({
    where: {
      id,
    },
  });
}

export function findUserByEmail(email: string) {
  return database.user.findUnique({
    where: {
      email,
    },
  });
}

export function deleteUser(id: string) {
  return database.user.delete({ where: { id } });
}
