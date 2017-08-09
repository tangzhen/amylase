const React = require('react');
const _ = require('lodash');
const PropTypes = require('prop-types');
const {ReactRouter013, ReactRouter3, ReactRouter4} = require('./version');

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}
function getLocation(path, pushState) {
  let search, pathname, state;
  if (typeof path === 'string') {
    const searchIndex = path.indexOf('?');
    if (searchIndex !== -1) {
      search = path.substr(searchIndex);
      pathname = path.substr(0, searchIndex)
    } else {
      pathname = path;
      search = ''
    }
    state = pushState;
  } else {
    if (path.search) {
      const isSearchStartWith = path.search.charAt(0) !== '?';
      search = isSearchStartWith ? '?' + path.search: path.search;
    } else {
      search = ''
    }
    pathname = !!path.pathname ? path.pathname : '';
    state = !! path.state ? path.state: {}
  }
  return {pathname, state, search: search === '?' ? '' : search};
}
function transformQueryToSearch(query) {
  return _.chain(query)
    .map((value, key)=> `${key}=${value}`)
    .join('&')
    .value();
}
class MemoryRouter extends React.Component {
  constructor(props) {
    super(props);
    this.history = {
      entries: [],
      location: {
        pathname: _.get(props, `initialEntries[${props.initialIndex}]`) || '/',
        search: '',
        state: {}
      },
      action: '',
      push: (path, pushState) => {
        const { pathname, search, state } = getLocation(path, pushState);
        this.history.location = {
          pathname,
          search,
          state
        };
        this.history.action = 'PUSH';
      },
      replace: (path, pushState) => {
        const { pathname, search, state } = getLocation(path, pushState);
        this.history.location = {
          pathname,
          search,
          state
        };
        this.history.action = 'REPLACE';
      },
      goBack: () => {
        this.history.action = 'POP';
        this.history.location.pathname = _.get(props, `initialEntries[${props.initialIndex -1}]`) || '/'
      }
    };
    this.router = () => {};
    if (ReactRouter013) {
      this.router.transitionTo = (path, params, query) => {
        //TODO: map the params to path.
        this.history.push({pathname: path, search: transformQueryToSearch(query)});
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
      this.history.location.pathname = _.get(this.props, `initialEntries[${this.index - 1}]`) || this.history.location.pathname;
      this.history.goBack();
    };
  }

  static propTypes = {
    initialEntries: PropTypes.array,
    initialIndex: PropTypes.number,
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
      router: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
    };

    static propTypes = {
      router: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
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
