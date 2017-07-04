import React from 'react';
import {mount} from 'enzyme';
const sinon = require('sinon').sandbox.create();
import {ReactRouter013, ReactRouter3, ReactRouter4} from '../src/version';
import {withRouter, push, replace, goBack} from '../src';

let MemoryRouter;
if (ReactRouter4) {
  const ReactRouter = require('react-router');
  MemoryRouter = ReactRouter.MemoryRouter;
}

describe('History modules', () => {
  const RouterStub = require('../src').routerStub(sinon);
  class Component extends React.Component {
    render() {
      return (
        <div>
          <h1 onClick={() => {push(this, '/push')}}>This is push</h1>
          <h1 onClick={() => {push(this, '/replace')}}>This is replace</h1>
          <h1 onClick={() => {push(this, '/goBack')}}>This is goBack</h1>
        </div>
      );
    }
  }
  const WrappedComponent = withRouter(Component);

  afterEach(() => {
    sinon.reset();
  });

  if (ReactRouter013) {
    it('should invoke transitionTo on router when call push method', () => {
      push(RouterStub, 'path');

      expect(RouterStub.transitionTo.calledWith('path')).to.be.true;
    });

    it('should invoke replaceWith on router when call replace method', () => {
      replace(RouterStub, 'path');

      expect(RouterStub.replaceWith.calledWith('path')).to.be.true;
    });

    testGoBackOfVersionLessThan4();
  } else if (ReactRouter3) {
    it('should invoke push on router when call push method', () => {
      push(RouterStub, 'path');

      expect(RouterStub.push.calledWith('path')).to.be.true;
    });

    it('should invoke replace on router when call replace method', () => {
      replace(RouterStub, 'path');

      expect(RouterStub.replace.calledWith('path')).to.be.true;
    });

    testGoBackOfVersionLessThan4();
  } else if (ReactRouter4) {
    it('should call history push after user click the push div', () => {
      const component = mount(<MemoryRouter><WrappedComponent /></MemoryRouter>);

      component.find('h1').first().simulate('click');
      expect(component.instance().history.location.pathname).to.be.equal('/push');
    });
  }

  function testGoBackOfVersionLessThan4() {
    it('should invoke goBack on router when call goBack method', () => {
      goBack(RouterStub);

      expect(RouterStub.goBack.called).to.be.true;
      expect(RouterStub.goBackStub.called).to.be.true;
    });

    it('should use push stub method do assertion', () => {
      push(RouterStub, 'path');

      expect(RouterStub.pushStub.calledWith('path')).to.be.true;
    });

    it('should use replace stub method do assertion', () => {
      replace(RouterStub, 'path');

      expect(RouterStub.replaceStub.calledWith('path')).to.be.true;
    });
  }
});
