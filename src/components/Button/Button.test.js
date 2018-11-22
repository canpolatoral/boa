import React from 'react';
import { assert, expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import Button from './Button';
import MuiButton from '@material-ui/core/Button';
import * as SvgIcons from '@material-ui/icons';

describe('<Button /> tests', () => {
  it('should render a <MuiButton> element', () => {
    const wrapper = shallow(<Button label="click" />).dive();
    assert.strictEqual(wrapper.shallow().type(), MuiButton);
  });

  it('should render a button with type="contained" by default', () => {
    const wrapper = shallow(<Button label="click" />).dive();
    assert.strictEqual(wrapper.name(), 'Button');
    assert.strictEqual(wrapper.props().type, 'contained');
  });

  it('should change type to flat', () => {
    const wrapper = shallow(<Button type="flat" label="click" />).dive();
    assert.strictEqual(wrapper.name(), 'Button');
    assert.strictEqual(wrapper.props().type, 'flat');
  });

  it('should change type to icon', () => {
    const wrapper = shallow(<Button type="icon" dynamicIcon="Home" label="click" />).dive();
    assert.strictEqual(wrapper.shallow().childAt(0).type(), SvgIcons.Home);
  });

  it('should render a dynamicIcon', () => {
    const wrapper = shallow(<Button label="click" dynamicIcon="Home" />).dive();
    assert.strictEqual(wrapper.shallow().childAt(0).type(), SvgIcons.Home);
  });

  it('should mount', () => {
    mount(<Button />);
  });

  it('calls componentDidMount', () => {
    sinon.spy(Button.prototype, 'componentDidMount');
    mount(<Button />);
    expect(Button.prototype.componentDidMount).to.have.property('callCount', 1);
  });

  it('simulates click events', () => {
    const onButtonClick = sinon.spy();
    const wrapper = mount(<Button onClick={onButtonClick} />);
    wrapper.find('button').simulate('click');
    expect(onButtonClick).to.have.property('callCount', 1);
  });
});
