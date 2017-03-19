import {ReactRouter013} from './version';
import ReactRouter from 'react-router';

function createRoute(options) {
  if (ReactRouter013) {
    const param = {
      name: options.name,
      path: options.path,
      handler: options.component
    };
    return ReactRouter.createRoute(param);
  }
}

export default createRoute;
