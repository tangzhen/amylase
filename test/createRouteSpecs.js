import {expect} from 'chai';
import {ReactRouter013} from '../src/version';
import {createRoute} from '../build';

describe('Create Route', () => {
  const component = () => {};
  const routeConfig = {
    name: 'appName',
    path: '/',
    component: component
  };

  if (ReactRouter013) {
    context('v0.13.x', () => {
      it('should use component as handler parameter', () => {
        const route = createRoute(routeConfig);

        expect(route.name).to.be.equal('appName');
        expect(route.path).to.be.equal('/');
        expect(route.handler).to.be.equal(component);
      });
    });
  }
});
