import { NextFunction, Request, Response } from 'express';
import { Controller } from '../../decorators/controller';
import { Route } from '../../decorators/route';
import { auth } from '../../middleware/auth';
import { deleteUser, findUserById, updateUser } from './services';
import { ERROR_TYPE, NotFound } from '../../constants/Errors';
import { UserMapper } from './Mapper';
import { updateUserSchema } from '../../constants/schemas';

@Controller('/user')
export default class UserController {
  @Route('get', '/profile', auth)
  async getProfile(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.body.auth;
    try {
      const user = await findUserById(userId);

      if (!user) {
        throw new NotFound([
          {
            code: ERROR_TYPE.NOT_FOUND_DATA,
            message: 'User not found',
          },
        ]);
      }

      res.json(UserMapper.toApi(user));
    } catch (err) {
      next(err);
    }
  }

  @Route('put', '/profile', auth)
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.body.auth;

    try {
      const user = await findUserById(userId);

      if (!user) {
        throw new NotFound([
          {
            code: ERROR_TYPE.NOT_FOUND_DATA,
            message: 'User not found',
          },
        ]);
      }
      updateUserSchema.parse(req.body);

      const newUser = await updateUser(user, req.body);
      res.json(UserMapper.toApi(newUser));
    } catch (err) {
      next(err);
    }
  }

  @Route('delete', '/profile', auth)
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.body.auth;
    try {
      const user = await findUserById(userId);

      if (!user) {
        throw new Error('User not Found');
      }

      await deleteUser(user.id);

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
}
