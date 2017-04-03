const {ReactRouter013, ReactRouter3} = require('./version');

export default function(sinon) {
  const RouterStub = () => {};
  if (ReactRouter013) {
    RouterStub.transitionTo = sinon.stub();
    RouterStub.replaceWith = sinon.stub();
    RouterStub.pushStub = RouterStub.transitionTo;
    RouterStub.replaceStub = RouterStub.replaceWith;
  } else if (ReactRouter3) {
    RouterStub.push = sinon.stub();
    RouterStub.replace = sinon.stub();
    RouterStub.pushStub = RouterStub.push;
    RouterStub.replaceStub = RouterStub.replace;
  }

  RouterStub.goBack = sinon.stub();
  RouterStub.goBackStub = RouterStub.goBack;

  return RouterStub;
}
