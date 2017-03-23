const ReactRouter = require('react-router');
const {ReactRouter013, ReactRouter3} = require('./version');

function render(reactRender, routes, el, callback) {
  if (ReactRouter013) {
    ReactRouter.run([routes], callback);
  } else if (ReactRouter3) {
    const Router = ReactRouter.Router;
    reactRender(<Router routes={routes} />, el);
  }
}

export default render();
