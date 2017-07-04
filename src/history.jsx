const React = require('react');
const _ = require('lodash');
const PropTypes = require('prop-types');
const {ReactRouter013, ReactRouter3, ReactRouter4} = require('./version');

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

class MemoryRouter extends React.Component {
  constructor(props) {
    super(props);
    this.history = {
      location: {
        pathname: _.get(props, `initialEntries[${props.initialIndex}]`) || '/'
      }
    };
    this.router = () => {};
    if (ReactRouter013) {
      this.router.transitionTo = (path) => {
        this.history.location.pathname = path;
      };
      this.router.replaceWith = (path) => {
        this.history.location.pathname = path;
      };
    } else {
      this.router.push = (path) => {
        this.history.location.pathname = path;
      };
      this.router.replace = (path) => {
        this.history.location.pathname = path;
      };
    }

    this.index = props.initialIndex;

    this.router.goBack = () => {
      this.history.location.pathname = _.get(this.props, `initialEntries[${this.index - 1}]`) || this.history.location.pathname;
    };
  }

  static propTypes = {
    initialEntries: PropTypes.array,
    initialIndex: PropTypes.number
  };

  render() {
    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, {
        router: this.router
      })
    );

    return <div>{childrenWithProps}</div>
  }
}

function withRouter(WrappedComponent) {
  class WithRouter extends React.Component {
    static contextTypes = {
      router: PropTypes.func
    };

    static propTypes = {
      router: PropTypes.func
    };

    static dispalyName = `withRouter(${getDisplayName(WrappedComponent)})`;
    static WrappedComponent = WrappedComponent;

    render() {
      const router = this.props.router || this.context.router;
      if (!router) {
        return <WrappedComponent {...this.props} />
      }

      return <WrappedComponent {...this.props} router={router} />;
    }
  }
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
  MemoryRouter: ReactRouter4 ? require('react-router').MemoryRouter : MemoryRouter,
  withRouter: ReactRouter4 ? require('react-router').withRouter : withRouter,
  push,
  replace,
  goBack
};

module.exports = exports;
