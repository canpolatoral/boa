import React from 'react';
import { assert, expect } from 'chai';
import { spy } from 'sinon';
import MuiButton from '@material-ui/core/Button';
import * as SvgIcons from '@material-ui/icons';
import Button from './Button';
import { createShallow, createMount } from '../../../test/utils';

describe('<Button /> tests', () => {
  let shallow;
  let mount;

  before(() => {
    shallow = createShallow({ dive: true });
    mount = createMount();
  });

  it('should render a <MuiButton> element', () => {
    const wrapper = shallow(<Button text="click" />);
    assert.strictEqual(wrapper.shallow().type(), MuiButton);
  });

  it('should render a button with type="contained" by default', () => {
    const wrapper = shallow(<Button text="click" />);
    assert.strictEqual(wrapper.name(), 'Button');
    assert.strictEqual(wrapper.props().type, 'contained');
    assert.strictEqual(wrapper.shallow().props().variant, 'contained');
  });

  it('should render a icon button when type is icon', () => {
    const wrapper = shallow(<Button type="icon" dynamicIcon="Home" text="click" />);
    assert.strictEqual(wrapper.shallow().props().dynamicIcon, 'Home');
    expect(wrapper.shallow().name()).contains('IconButton');
  });

  it('should render a dynamicIcon', () => {
    const wrapper = shallow(<Button text="click" dynamicIcon="Home" />);
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
    const onButtonClick = spy();
    const wrapper = mount(<Button onClick={onButtonClick} />);
    wrapper.find('button').simulate('click');
    expect(onButtonClick).to.have.property('callCount', 1);
  });

  it('should label formatted uppercase when allowLabelCase is false', () => {
    const wrapper = shallow(<Button text="aaa" allowLabelCase={false} />);
    assert.strictEqual(wrapper.shallow().instance().getLabel(), 'AAA');
  });

  it('should label be empty when allowLabelCase is false and text is null', () => {
    const wrapper = shallow(<Button text={null} allowLabelCase={false} />);
    assert.strictEqual(wrapper.shallow().instance().getLabel(), '');
  });

  it('should assign icon styles', () => {
    const wrapper = mount((
      <Button
        text="style"
        dynamicIcon="Home"
        iconProperties={{ style: { marginLeft: 8 } }} />
    ));
    assert.strictEqual(wrapper.props().iconProperties.style.marginRight, 8);
  });

  it('should assign textPosition', () => {
    const wrapper = mount((
      <Button
        text="style"
        textPosition="right" />
    ));
    let muiButton = wrapper.find(MuiButton);
    assert.strictEqual(muiButton.props().style.justifyContent, 'flex-end');
    wrapper.setProps({ textPosition: 'left' });
    muiButton = wrapper.find(MuiButton);
    assert.strictEqual(muiButton.props().style.justifyContent, 'left');
  });
});
