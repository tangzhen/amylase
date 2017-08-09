const _ = require('lodash');

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
  const queryString = _.chain(query)
    .map((value, key)=> `${key}=${value}`)
    .join('&')
    .value();

  return `?${queryString}`;
}

module.exports = {
  getLocation,
  transformQueryToSearch
};