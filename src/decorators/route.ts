import { Express, RequestHandler } from 'express';
import { RouteHandler } from '../config/routes';

export function Route(
  method: keyof Express,
  path: string,
  ...middlewares: RequestHandler[]
) {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const routePath = path;
    const routeHandlers: RouteHandler =
      Reflect.getMetadata('routeHandlers', target) || new Map();

    if (!routeHandlers.has(method)) {
      routeHandlers.set(method, new Map());
    }

    routeHandlers
      .get(method)
      ?.set(routePath, [...middlewares, descriptor.value]);

    Reflect.defineMetadata('routeHandlers', routeHandlers, target);
  };
}
