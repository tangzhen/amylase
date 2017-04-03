Amylase
====
This package is used help you upgrade the react-router old version(0.13.x) to newer version(3.x).

Use plain json configuration to config the routes(data schema use v4.0 react-router-config)

```javascript
import {createRoute, render} from 'amylase';

const routeConfig = {
  name: 'appName',
  path: '/',
  component: component
};
const routes = createRoute(routeConfig);

// Render
// ReactDom.render(<Router routes={routes} />, app);
render(ReactDom.render, routes, app, callback); // callback is 0.13 router change callback
```

Use HOC `withRouter` to replace the Navigation mixin.

```javascript
const {push, replace, goBack} = require('amylase');

const ReactComponent = React.createClass({
  propTypes: {
    router: React.PropTypes.func // The router constructor function
  },
  
  divTap() {
    push(this.props.router, '/air/booking/shopping');
  },

  render() {
    return (<div onClick={this.divTap}>{'Component'}</div>)
  }
});
```

Use `routerStub` help us do assertion in you unit test, because we use the HOC, so we can pass router props to origin 
component instead of mount component with router context.

```javascript
import {push, replace, goBack} from 'amylase';

describe('Unit test', () => {
  const RouterStub = require('../src').routerStub(sinon);
  
  it('should push path', () => {
    // mount component with router props
    mount(<Component router={RouterStub} />);
    // click element
    
    // assert history change
    expect(RouterStub.pushStub).to.have.been.calledWith('path');
    expect(RouterStub.replaceStub).to.have.been.calledWith('path');
    expect(RouterStub.goBack).to.have.been.called;
  });
});
```
