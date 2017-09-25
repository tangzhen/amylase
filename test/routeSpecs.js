import React from 'react';
import {mount} from 'enzyme';
import {MemoryRouter, withRouter, Route} from '../build';

describe('route', () => {
  class Component extends React.Component {
    render() {
      return (
        <div>
          <div className='path'>{this.props.match.path}</div>
          <div className='url'>{this.props.match.url}</div>
          <div className='id'>{this.props.match.params.id}</div>
          <div className='name'>{this.props.match.params.name}</div>
        </div>
      );
    }
  }
  const WrappedComponent = withRouter(Component);

  it('should passing the match to component', () => {
    const component = mount(
      <MemoryRouter initialEntries={['/home/123/zhen']} initialIndex={0}>
        <Route render={props => <WrappedComponent {...props}/>} path="/home/:id/:name" />
      </MemoryRouter>
    );

    expect(component.find('.path').text()).to.be.equal('/home/:id/:name');
    expect(component.find('.url').text()).to.be.equal('/home/123/zhen');
    expect(component.find('.id').text()).to.be.equal('123');
    expect(component.find('.name').text()).to.be.equal('zhen');
  });
});
