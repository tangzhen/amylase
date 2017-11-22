const {ReactRouter4} = require('./version');

export const Link = ReactRouter4 ? require('react-router-dome').Link : require('react-router').Link;
export {createRoute, createRouteComponentWithConfig} from './createRoute';
export render from './render';
export {MemoryRouter, withRouter, push, replace, goBack} from './history';
export {Route} from './route';
