import {expect} from 'chai';
const sinon = require('sinon').sandbox.create();
import {ReactRouter013, ReactRouter3} from '../src/version';
import {push, replace, goBack} from '../src';

describe('History modules', () => {
  const RouterStub = require('../src').routerStub(sinon);

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
  } else if (ReactRouter3) {
    it('should invoke push on router when call push method', () => {
      push(RouterStub, 'path');

      expect(RouterStub.push.calledWith('path')).to.be.true;
    });

    it('should invoke replace on router when call replace method', () => {
      replace(RouterStub, 'path');

      expect(RouterStub.replace.calledWith('path')).to.be.true;
    });
  }

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
});
