import { NextFunction, Request, Response } from 'express';
import { Controller } from '../../decorators/controller';
import { Route } from '../../decorators/route';

@Controller()
export default class MainController {
  @Route('get', '/')
  getHealthCheck(req: Request, res: Response, next: NextFunction) {
    logging.info('Health check called successfully');
    return res.status(200).json({ hello: 'world' });
  }

  @Route('get', '/health-check')
  getTest(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json({ hello: 'world2' });
  }
}
