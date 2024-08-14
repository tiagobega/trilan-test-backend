import { NextFunction, Request, Response } from 'express';
import { Controller } from '../../decorators/controller';
import { Route } from '../../decorators/route';
import { auth } from '../../middleware/auth';

@Controller('/user')
export default class UserController {
  @Route('get', '/profile', auth)
  async getProfile(req: Request, res: Response, next: NextFunction) {
    console.log(req.body);
    res.json({id: req.body.userId})
  }

  // @Route('post', '/:userId')
  // async updateUser(req: Request, res: Response, next: NextFunction) {}

  // @Route('delete', '/:userId')
  // async deleteUser(req: Request, res: Response, next: NextFunction) {}
}
