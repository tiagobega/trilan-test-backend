import express from 'express';
import http from 'http';
import 'reflect-metadata';

import './config/app';
import './config/jwt';
import './config/logging';

import { defineRoutes } from './config/routes';
import { corsHandler } from './middleware/corsHandler';
import { loggingHandler } from './middleware/loggingHandler';
import { routeNotFound } from './middleware/routeNotFound';

import SERVER from './config/app';

import AuthController from './features/auth/Controller';
import MainController from './features/main/Controller';
import UserController from './features/user/Controller';
import { errorHandler } from './middleware/errorHandler';

export const application = express();
let httpServer: ReturnType<typeof http.createServer>;

logging.info('initializing API');
application.use(express.urlencoded({ extended: true }));
application.use(express.json());

logging.info('Logging & config');
application.use(loggingHandler);
application.use(corsHandler);

logging.info('Define Routes');
defineRoutes([MainController, AuthController, UserController], application);

application.use(errorHandler);
application.use(routeNotFound);

if (SERVER.isDevelopment) {
  logging.info('Start Server');
  httpServer = http.createServer(application);
  httpServer.listen(SERVER.SERVER_PORT, () => {
    logging.info(
      `Server Started at:  ${SERVER.SERVER_HOSTNAME}:${SERVER.SERVER_PORT}`
    );
  });
}

export const shutdown = (callback: (err?: Error) => void) => {
  httpServer?.close(callback);
};
export default application;
