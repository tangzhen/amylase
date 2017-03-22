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
    if (Array.isArray(options.routes)) {
      options.routes.forEach((childRoute) => {
        if (ReactRouter.Redirect === childRoute.component) {
          route.appendChild(ReactRouter.createRedirect(childRoute));
        } else {
          route.appendChild(ReactRouter.createRoute(convertRouteOptions(childRoute)));
        }
      })
    }
    return route;
  }
}

export default createRoute;
