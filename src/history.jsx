const React = require('react');
const {ReactRouter013, ReactRouter3} = require('./version');

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

const {func} = React.PropTypes;

function withRouter(WrappedComponent) {
  const WithRouter = React.createClass({
    contextTypes: {
      router: func
    },

    propTypes: {
      router: func
    },

    render: function() {
      const router = this.props.router || this.context.router;
      if (!router) {
        return <WrappedComponent {...this.props} />
      }

      return <WrappedComponent {...this.props} router={router} />;
    }
  });

  WithRouter.displayName = `withRouter(${getDisplayName(WrappedComponent)})`;
  WithRouter.WrappedComponent = WrappedComponent;

  return WithRouter;
}

function goBack(router) {
  router.goBack();
}

function push(router, path, params, query) {
  if (ReactRouter013) {
    router.transitionTo(path, params, query);
  } else if (ReactRouter3) {
    router.push(path, params, query);
  }
}

function replace(router, path, params, query) {
  if (ReactRouter013) {
    router.replaceWith(path, params, query);
  } else if (ReactRouter3) {
    router.replace(path, params, query);
  }
}

module.exports = {
  withRouter,
  push,
  replace,
  goBack
};
