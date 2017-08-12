const {ReactRouter013, ReactRouter3, ReactRouter4} = require('./version');
const ReactRouter = require('react-router');

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
  } else if (ReactRouter3) {
    const createRoute = (route) => {
      const {path, component} = route;
      const result = {component};
      if (path) {
        result.path = path;
      }

      if (Array.isArray(route.routes)) {
        if (route.routes[0].path === undefined) {
          result.indexRoute = route.routes[0];
          route.routes.shift();
        }
        result.childRoutes = route.routes.map(createRoute);
      }

      return result;
    };

    return createRoute(options);
  }
}

const createRouteComponentWithConfig = (routerConfig, createElement) => {
  const {Route, DefaultRoute} = ReactRouter;
  if (ReactRouter013) {

    const createRouteComponent = (config, childRoutes) => {
      let routeType;
      const {name, path, component} = config;
      if (!!path) {
        routeType = Route;
      } else {
        routeType = DefaultRoute;
      }
      return createElement(routeType, {
        name,
        path,
        handler: component
      }, ...childRoutes);
    };

    let childRoutes = [];
    if (Array.isArray(routerConfig.routes)) {
      childRoutes = routerConfig.routes.map((route, index) => createRouteComponentWithConfig(route));
    }

    return createRouteComponent(routerConfig, childRoutes);

  } else if (ReactRouter4) {

    const createRouteComponent = (config) => {
      const {path, component} = config;
      return createElement(Route, {
        path,
        component,
        exact: true
      });
    };

    const createNewConfig = (routerConfig, parentPath) => {
      let currentAbsolutePath;
      let newConfigs = [];
      const {path, component} = routerConfig;
      if (!!parentPath) {
        if (!!component) {
          if (!!path) {
            currentAbsolutePath = `${parentPath}/${path}`;
          } else {
            currentAbsolutePath = parentPath;
          }
          newConfigs.push({path: currentAbsolutePath, component});
        }
        currentAbsolutePath = `${parentPath}/${path}`;
      } else {
        currentAbsolutePath = path;
      }
      if (Array.isArray(routerConfig.routes)) {
        const childRoutesConfig = routerConfig.routes;
        childRoutesConfig.forEach((routeConfig) => {
          newConfigs.push(...createNewConfig(routeConfig, currentAbsolutePath));
        });
      }
      return newConfigs;
    };

    const newRouterConfigs = createNewConfig(routerConfig);
    const flowRouteHandler = routerConfig.component;
    const flowRoutes = newRouterConfigs.map(routeConfig => createRouteComponent(routeConfig));

    return createElement(flowRouteHandler, null, ...flowRoutes);
  }
};

module.exports = {
  createRoute,
  createRouteComponentWithConfig
};
