const React = require('react');
const ReactRouter = require('react-router');
const {ReactRouter013, ReactRouter3, ReactRouter4} = require('./version');

function render(reactRender, history, routes, el, callback) {
  if (ReactRouter013) {
    ReactRouter.run([routes], history, callback);
  } else if (ReactRouter3) {
    const Router = ReactRouter.Router;
    reactRender(<Router routes={routes} history={history}/>, el);
  } else if (ReactRouter4) {
    const Router = ReactRouter.Router;
    reactRender(<Router history={history}>{routes}</Router>, el);
  }
}

export default render;
