import {ReactRouter013} from './version';
import ReactRouter from 'react-router';

function createRoute(options) {
  if (ReactRouter013) {
    const param = {
      name: options.name,
      path: options.path,
      handler: options.component
    };
    const route = ReactRouter.createRoute(param);
    if (options.indexRoute) {
      route.appendChild(ReactRouter.createDefaultRoute({handler: options.indexRoute.component}));
    }
    return route;
  }
}

export default createRoute;
