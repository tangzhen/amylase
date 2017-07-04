const React = require('react');
const PropTypes = require('prop-types');
const {ReactRouter013, ReactRouter3, ReactRouter4} = require('./version');

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

function withRouter(WrappedComponent) {
  const WithRouter = React.createClass({
    contextTypes: {
      router: PropTypes.func
    },

    render: function() {
      const router = this.props.router || this.context.router;
      if (!router) {
        return <WrappedComponent {...this.props} />
      }

      return <WrappedComponent {...this.props} router={router} />;
    }
  });

  WithRouter.propTypes = {
    router: PropTypes.func
  };
  WithRouter.displayName = `withRouter(${getDisplayName(WrappedComponent)})`;
  WithRouter.WrappedComponent = WrappedComponent;

  return WithRouter;
}

function goBack(component) {
  if (ReactRouter4) {
    component.props.history.goBack();
  } else {
    component.props.router.goBack();
  }
}

function push(component, path, params, query) {
  if (ReactRouter013) {
    component.props.router.transitionTo(path, params, query);
  } else if (ReactRouter3) {
    component.props.router.push(path, params, query);
  } else if (ReactRouter4) {
    component.props.history.push({
      pathname: path,
      search: query
    });
  }
}

/*
  >= 4, passing the this.props.history
  < 4, passing the this.props.router
 */
function replace(component, path, params, query) {
  if (ReactRouter013) {
    component.props.router.replaceWith(path, params, query);
  } else if (ReactRouter3) {
    component.props.router.replace(path, params, query);
  } else if (ReactRouter4) {
    component.props.history.replace({
      pathname: path,
      search: query
    });
  }
}

const exports = {
  withRouter: ReactRouter4 ? require('react-router').withRouter : withRouter,
  push,
  replace,
  goBack
};

module.exports = exports;
