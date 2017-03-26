import {expect} from 'chai';
import {Redirect} from 'react-router';
import {ReactRouter013, ReactRouter3} from '../src/version';
import {createRoute} from '../build';
import _ from 'lodash';

function findRouteHasChild(route, options) {
  let result = false;

  if (route.childRoutes) {
    route.childRoutes.forEach((route) => {
      result = result || _.isMatch(route, options);
    })
  }

  return result;
}

describe('Create Route', () => {
  const componentOne = () => {};
  const componentTwo = () => {};
  const componentThree = () => {};

  if (ReactRouter013) {
    context('v0.13.x', () => {
      it('should use componentOne as handler parameter', () => {
        const routeConfig = {
          name: 'appName',
          path: '/',
          component: componentOne
        };
        const route = createRoute(routeConfig);

        expect(route.name).to.be.equal('appName');
        expect(route.path).to.be.equal('/');
        expect(route.handler).to.be.equal(componentOne);
      });

      it('should use childRoutes to create child route', () => {
        const routeConfig = {
          name: 'appName',
          path: '/',
          component: componentOne,
          routes: [{
            name: 'routeOne',
            path: 'one',
            component: componentTwo
          }, {
            name: 'routeTwo',
            path: 'two',
            component: componentThree
          }]
        };

        const route = createRoute(routeConfig);
        expect(findRouteHasChild(route, {name: 'routeOne', path: '/one', handler: componentTwo})).to.be.true;
        expect(findRouteHasChild(route, {name: 'routeTwo', path: '/two', handler: componentThree})).to.be.true;
      });

      it('should use redirect to create redirect route', () => {
        const routeConfig = {
          name: 'appName',
          path: '/',
          component: componentOne,
          routes: [{
            name: 'routeOne',
            path: 'one',
            component: componentTwo
          }, {
            name: 'routeTwo',
            path: 'two',
            component: componentThree
          }, {
            name: '404',
            from: '/*',
            to: '/',
            component: Redirect
          }]
        };

        const route = createRoute(routeConfig);
        expect(findRouteHasChild(route, {path: '/*'})).to.be.true;
      });

      it('should convert nested routes', () => {
        const routeConfig = {
          name: 'appName',
          path: '/',
          component: componentOne,
          routes: [{
            name: 'routeOne',
            path: 'one',
            component: componentTwo,
            routes: [{
              name: 'routeTwo',
              path: 'two',
              component: componentThree
            }]
          }]
        };

        const route = createRoute(routeConfig);
        const routeTwo = route.childRoutes[0].childRoutes[0];

        expect(routeTwo.name).to.be.equal('routeTwo');
        expect(routeTwo.handler).to.be.equal(componentThree);
      });

      it('should convert first child route to default route if it does not contain path', () => {
        const routeConfig = {
          name: 'appName',
          path: '/',
          component: componentOne,
          routes: [{
            component: componentTwo
          }]
        };

        const route = createRoute(routeConfig);

        expect(route.childRoutes[0].isDefault).to.be.true;
      });
    });
  }

  if (ReactRouter3) {
    it('should convert config to route', () => {
      const routeConfig = {
        name: 'appName',
        path: '/',
        component: componentOne,
        routes: [{
          component: componentTwo
        }, {
          name: 'routeOne',
          path: 'one',
          component: componentTwo,
          routes: [{
            name: 'routeTwo',
            path: 'two',
            component: componentThree
          }]
        }, {
          name: '404',
          from: '/*',
          to: '/',
          component: Redirect
        }]
      };

      const route = createRoute(routeConfig);

      expect(route.component).to.be.equal(componentOne);
      expect(route.path).to.be.equal('/');
      expect(route.indexRoute.component).to.be.equal(componentTwo);
      expect(route.childRoutes).to.be.instanceof(Array);
    });
  }
});
