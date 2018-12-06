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

  it('should change type to text', () => {
    const wrapper = shallow(<Button type="text" label="click" />).dive();
    assert.strictEqual(wrapper.name(), 'Button');
    assert.strictEqual(wrapper.props().type, 'text');
  });

  it('should change type to icon', () => {
    const wrapper = shallow(<Button type="icon" dynamicIcon="Home" label="click" />).dive();
    const iconButton = wrapper.shallow().dive();
    assert.strictEqual(iconButton.shallow().dive().childAt(0).type(), SvgIcons.Home);
  });

  it('should render a dynamicIcon', () => {
    const wrapper = shallow(<Button label="click" dynamicIcon="Home" />).dive();
    assert.strictEqual(wrapper.shallow().childAt(0).type(), SvgIcons.Home);
  });

  it('should mount', () => {
    mount(<Button />);
  });

  it('should change disabled prop', () => {
    const wrapper = mount(<Button />);
    const mui = wrapper.find(MuiButton);
    wrapper.setProps({ disabled: true });
    expect(mui.props().disabled, wrapper.state.disabled);
    expect(wrapper.state.disabled, true);
  });

  it('simulates click events', () => {
    const onButtonClick = sinon.spy();
    const wrapper = mount(<Button onClick={onButtonClick} />);
    wrapper.find('button').simulate('click');
    expect(onButtonClick).to.have.property('callCount', 1);
  });
});
