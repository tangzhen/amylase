const React = require('react');
const _ = require('lodash');
const url = require('url');
const querystring = require('querystring');
const PropTypes = require('prop-types');
const {ReactRouter013, ReactRouter3, ReactRouter4} = require('./version');
const {getLocation, transformQueryToSearch} = require('./utils');

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

class MemoryRouter extends React.Component {
  constructor(props) {
    super(props);
    const urlObj = url.parse(_.get(props, `initialEntries[${props.initialIndex}]`) || '/');
    this.history = {
      entries: [],
      location: {
        pathname: urlObj.pathname,
        search: urlObj.search,
        state: {}
      },
      action: '',
      push: (path, pushState) => {
        const {pathname, search, state} = getLocation(path, pushState);
        this.history.location = {
          pathname,
          search,
          state
        };
        this.history.action = 'PUSH';
      },
      replace: (path, pushState) => {
        const {pathname, search, state} = getLocation(path, pushState);
        this.history.location = {
          pathname,
          search,
          state
        };
        this.history.action = 'REPLACE';
      },
      goBack: () => {
        this.history.action = 'POP';
        const urlObj = url.parse(_.get(props, `initialEntries[${props.initialIndex - 1}]`) || '/');
        this.history.location.pathname = urlObj.pathname;
        this.history.location.search = urlObj.search;
      }
    };
    this.router = () => {
    };
    if (ReactRouter013) {
      this.router.transitionTo = (path, params, query) => {
        //TODO: map the params to path.
        if (!_.isEmpty(query)) {
          this.history.push({pathname: path, search: transformQueryToSearch(query)});
        } else {
          const {pathname, search} = url.parse(path);
          this.history.push({pathname, search})
        }
      };
      this.router.replaceWith = (path, params, query) => {
        //TODO: map the params to path.
        this.history.replace({pathname: path, search: transformQueryToSearch(query)});
      };
    } else {
      this.router.push = (path, state) => {
        this.history.push(path, state);
      };
      this.router.replace = (path, state) => {
        this.history.replace(path, state);
      };
    }
    this.index = props.initialIndex;

    this.router.goBack = () => {
      this.history.goBack();
      const urlObj = url.parse(_.get(this.props, `initialEntries[${this.index - 1}]`) || this.history.location.pathname);
      this.history.location.pathname = urlObj.pathname;
      this.history.location.search = urlObj.search;
    };
    this.router.getCurrentParams = () => {
    };
    this.router.getCurrentQuery = () => {
      if (typeof this.history.location.search === 'string') {
        return querystring.parse(url.parse(this.history.location.search).query)
      } else {
        return {};
      }
    };
    this.router.getCurrentPathname = () => this.history.location.pathname;
  }

  static propTypes = {
    initialEntries: PropTypes.array,
    initialIndex: PropTypes.number
  };

  static childContextTypes = {
    router: PropTypes.object.isRequired
  };

  getChildContext() {
    return {
      router: {
        history: this.history,
        route: {
          location: this.history.location
        }
      }
    };
  }

  render() {
    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, {
        router: this.router
      })
    );

    return <div>{childrenWithProps}</div>;
  }
}

function withRouter(WrappedComponent) {
  class WithRouter extends React.Component {
    static contextTypes = {
      router: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
    };

    static propTypes = {
      router: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
    };

    static displayName = `withRouter(${getDisplayName(WrappedComponent)})`;
    static WrappedComponent = WrappedComponent;

    render() {
      const router = this.props.router || this.context.router;
      const location = {
        search: transformQueryToSearch(router.getCurrentQuery()),
        pathname: router.getCurrentPathname()
      };

      let routerMatch = {};
      if (typeof this.context.router.match === 'function') {
        routerMatch = this.context.router.match(router.getCurrentPathname());
      }
      const match = this.props.match || routerMatch;

      if (!router) {
        return <WrappedComponent {...this.props} />;
      }

      return <WrappedComponent {...this.props} router={router} location={location} match={match}/>;
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
    component.props.history.push(path);
  }
}

function replace(component, path, params, query) {
  if (ReactRouter013) {
    component.props.router.replaceWith(path, params, query);
  } else if (ReactRouter3) {
    component.props.router.replace(path, params, query);
  } else if (ReactRouter4) {
    component.props.history.replace(path);
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
