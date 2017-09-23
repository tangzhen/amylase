import React from 'react'
import PropTypes from 'prop-types'
import matchPath from './matchPath'
const {ReactRouter4} = require('./version');

const isEmptyChildren = (children) =>
  React.Children.count(children) === 0

/**
 * The public API for matching a single path and rendering.
 */
class Route extends React.Component {
  static propTypes = {
    computedMatch: PropTypes.object, // private, from <Switch>
    path: PropTypes.string,
    exact: PropTypes.bool,
    strict: PropTypes.bool,
    sensitive: PropTypes.bool,
    component: PropTypes.func,
    render: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node
    ]),
    location: PropTypes.object
  };

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.object.isRequired,
      route: PropTypes.object.isRequired,
      staticContext: PropTypes.object
    })
  };

  static childContextTypes = {
    router: PropTypes.object.isRequired
  };

  getChildContext() {
    return {
      router: {
        ...this.context.router,
        route: {
          location: this.props.location || this.context.router.route.location,
          match: this.state.match
        }
      }
    }
  }

  state = {
    match: this.computeMatch(this.props, this.context.router)
  };

  computeMatch({ location, path, strict, exact, sensitive }, router) {
    const { route } = router;
    const pathname = (location || route.location).pathname;

    return path ? matchPath(pathname, { path, strict, exact, sensitive }) : route.match
  }

  render() {
    const { match } = this.state;
    const { children, component, render } = this.props;
    const { history, route, staticContext } = this.context.router;
    const location = this.props.location || route.location;
    const props = { match, location, history, staticContext };

    if (component)
      return match ? React.createElement(component, props) : null;

    if (render)
      return match ? render(props) : null;

    if (typeof children === 'function')
      return children(props);

    if (children && !isEmptyChildren(children))
      return React.Children.only(children);

    return null
  }
}

const exports = {
  Route: ReactRouter4 ? require('react-router').Route : Route,
};
module.exports = exports;
