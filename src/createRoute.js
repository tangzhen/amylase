import {ReactRouter013} from './version';
import ReactRouter from 'react-router';

function createRoute(options) {
  if (ReactRouter013) {
    const convertRouteOptions = (oldOptions) => {
      return {
        name: oldOptions.name,
        path: oldOptions.path,
        handler: oldOptions.component
      };
    };

    const route = ReactRouter.createRoute(convertRouteOptions(options));

    const createRoutes = (parentRoot, routes) => {
      if (Array.isArray(routes)) {
        routes.forEach((route, index) => {
          if (ReactRouter.Redirect === route.component) {
            ReactRouter.createRedirect(Object.assign({}, route, {parentRoute: parentRoot}));
          } else if (index === 0 && route.path === undefined) {
            ReactRouter.createDefaultRoute(Object.assign({}, convertRouteOptions(route), {parentRoute: parentRoot}));
          } else {
            const newRoute = ReactRouter.createRoute(Object.assign({}, convertRouteOptions(route), {parentRoute: parentRoot}));

            if (route.routes) {
              createRoutes(newRoute, route.routes);
            }
          }
        })
      }
    };

    createRoutes(route, options.routes);
    return route;
  }
}

export default createRoute;
