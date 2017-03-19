import {expect} from 'chai';
import {ReactRouter013} from '../src/version';
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

      it('should use indexRoute to create DefaultHandler', () => {
        const routeConfig = {
          name: 'appName',
          path: '/',
          component: componentOne,
          indexRoute: {
            component: componentTwo
          }
        };
        const route = createRoute(routeConfig);

        expect(findRouteHasChild(route, {handler: componentTwo})).to.be.true;
      });
    });
  }
});
