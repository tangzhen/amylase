const React = require('react');
const ReactRouter = require('react-router');
const {ReactRouter013, ReactRouter3} = require('./version');

function render(reactRender, routes, el, callback) {
  if (ReactRouter013) {
    ReactRouter.run([routes], ReactRouter.HistoryLocation, callback);
  } else if (ReactRouter3) {
    const Router = ReactRouter.Router;
    reactRender(<Router routes={routes} history={ReactRouter.browserHistory}/>, el);
  }
}

export default render;
