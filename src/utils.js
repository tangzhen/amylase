const _ = require('lodash');
const qs = require('qs');

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
  const queryString = qs.stringify(query);

  return `?${queryString}`;
}

function buildPathWithParamAndQuery(path, params, query) {
  const replaceParams = halfPath => _.startsWith(halfPath, ':') ? params[halfPath.slice(1)] : halfPath;
  const search = _.chain(query)
    .pickBy(_.identity)
    .map((key, value) => `${value}=${key}`)
    .join('&')
    .value();

  const newRoutePath = _.chain(path)
    .split('/')
    .map(replaceParams)
    .join('/')
    .value();

  return _.isEmpty(search) ? newRoutePath : `${newRoutePath}?${search}`;
}

module.exports = {
  getLocation,
  transformQueryToSearch,
  buildPathWithParamAndQuery
};
