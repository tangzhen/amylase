const ReactRouter = require('react-router');

let version = 0;

if (ReactRouter.Navigation !== undefined) {
  version = 13;
} else if (ReactRouter.MemoryRouter !== undefined) {
  version = 4;
} else if (ReactRouter.RoutingContext !== undefined) {
  version = 2;
} else if (ReactRouter.withRouter !== undefined) {
  version = 3;
} else {
  version = 1;
}

export const ReactRouter013 = version === 13;
export const ReactRouter1 = version === 1;
export const ReactRouter2 = version === 2;
export const ReactRouter3 = version === 3;
export const ReactRouter4 = version === 4;
