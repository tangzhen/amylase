import React from 'react';
import {mount} from 'enzyme';
const sinon = require('sinon').sandbox.create();
import {ReactRouter013, ReactRouter3, ReactRouter4} from '../src/version';
import {MemoryRouter, withRouter, push, replace, goBack} from '../build';

describe('History modules', () => {
  class Component extends React.Component {
    render() {
      return (
        <div>
          <h1 onClick={() => {
            push(this, '/push')
          }}>This is push</h1>
          <h1 onClick={() => {
            replace(this, '/replace')
          }}>This is replace</h1>
          <h1 onClick={() => {
            goBack(this)
          }}>This is goBack</h1>
        </div>
      );
    }
  }
  const WrappedComponent = withRouter(Component);

  afterEach(() => {
    sinon.reset();
  });

  it('should invoke push on router when call push method', () => {
    const component = mount(<MemoryRouter><WrappedComponent /></MemoryRouter>);

    component.find('h1').first().simulate('click');
    expect(component.instance().history.location.pathname).to.be.equal('/push');
  });

  it('should invoke replace on router when call replace method', () => {
    const component = mount(<MemoryRouter><WrappedComponent /></MemoryRouter>);

    component.find('h1').at(1).simulate('click');
    expect(component.instance().history.location.pathname).to.be.equal('/replace');
  });

  it('should invoke goBack on router when call goBack method', () => {
    const component = mount(<MemoryRouter initialEntries={['/one', '/two']}
                                          initialIndex={1}><WrappedComponent /></MemoryRouter>);

    component.find('h1').at(2).simulate('click');
    expect(component.instance().history.location.pathname).to.be.equal('/one');
  });
});
