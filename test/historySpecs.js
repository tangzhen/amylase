import React from 'react';
import {mount} from 'enzyme';
const sinon = require('sinon').sandbox.create();
import {MemoryRouter, withRouter, push, replace, goBack} from '../build';
const Link = require('react-router').Link || require('react-router-dom').Link;

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
          <h1 onClick={() => {
            push(this, '/push?withParams=true')
          }}>This is push</h1>
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

  it('should generate correct pathname and search', () => {
    const component = mount(<MemoryRouter><WrappedComponent /></MemoryRouter>);

    component.find('h1').at(3).simulate('click');
    expect(component.instance().history.location.pathname).to.be.equal('/push');
    expect(component.instance().history.location.search).to.be.equal('?withParams=true');
  });

  it('should Link correct', () => {
    const component = mount(<MemoryRouter><Link to={'/new-url'}/></MemoryRouter>);

    component.find('Link').simulate('click', {button: 0});
    expect(component.instance().history.location.pathname).to.be.equal('/new-url');
  });
});
