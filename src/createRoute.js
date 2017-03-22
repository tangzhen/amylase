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
    if (options.indexRoute) {
      route.appendChild(ReactRouter.createDefaultRoute({handler: options.indexRoute.component}));
    }

    const createRoutes = (parentRoot, routes) => {
      if (Array.isArray(routes)) {
        routes.forEach((route, index) => {
          if (ReactRouter.Redirect === route.component) {
            parentRoot.appendChild(ReactRouter.createRedirect(route));
          } else if (index === 0 && route.path === undefined) {
            parentRoot.appendChild(ReactRouter.createDefaultRoute(convertRouteOptions(route)));
          } else {
            const newRoute = ReactRouter.createRoute(convertRouteOptions(route));
            parentRoot.appendChild(newRoute);

            if(route.routes) {
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
