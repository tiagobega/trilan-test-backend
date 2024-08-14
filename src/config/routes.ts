import { Express, RequestHandler } from 'express';

export type RouteHandler = Map<keyof Express, Map<string, RequestHandler[]>>;

export function defineRoutes(controllers: any, application: Express) {
  for (let controller of controllers) {
    controller = new controller();

    const routeHandlers: RouteHandler = Reflect.getMetadata(
      'routeHandlers',
      controller
    );
    const controllerPath: string = Reflect.getMetadata(
      'baseRoute',
      controller.constructor
    );
    const methods = Array.from(routeHandlers.keys());

    for (let method of methods) {
      const routes = routeHandlers.get(method);

      if (!routes) continue;

      const routeNames = Array.from(routes.keys());

      for (let route of routeNames) {
        const handlers = routes.get(route);

        if (!handlers) continue;

        const routePath = `${controllerPath}${route}`;

        application[method](routePath, handlers);
        logging.log('Loading route: ', method, routePath);
      }
    }
  }
}
