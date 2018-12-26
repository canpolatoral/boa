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

  after(() => {
    mount.cleanUp();
  });

  it('should render a <MuiButton> element', () => {
    const wrapper = shallow(<Button text="click" />);
    assert.strictEqual(wrapper.dive().type(), MuiButton);
  });

  it('should render a button with type="contained" by default', () => {
    const wrapper = shallow(<Button text="click" />);
    assert.strictEqual(wrapper.name(), 'Button');
    assert.strictEqual(wrapper.props().type, 'contained');
    assert.strictEqual(wrapper.dive().props().variant, 'contained');
  });

  it('should render a icon button with type="icon"', () => {
    const wrapper = shallow(<Button type="icon" text="click" />);
    expect(wrapper.dive().name()).contains('IconButton');
  });

  it('should render a SVG Icon with dynamicIcon="Home"', () => {
    const wrapper = shallow(<Button text="click" dynamicIcon="Home" />);
    assert.strictEqual(wrapper.dive().childAt(0).type(), SvgIcons.Home);
  });

  it('should assign outer style to default style', () => {
    const wrapper = mount((
      <Button
        text="style"
        dynamicIcon="Home"
        iconProperties={{ style: { marginLeft: 8 } }} />
    ));
    assert.strictEqual(wrapper.props().iconProperties.style.marginRight, 8);
    assert.strictEqual(wrapper.find(SvgIcons.Home).props().style.marginLeft, 8);
  });

  it('should mount', () => {
    mount(<Button />);
  });

  it('should change disabled prop', () => {
    const wrapper = shallow(<Button text="click" />).shallow();
    wrapper.setProps({ disabled: true });
    assert.strictEqual(wrapper.state().disabled, true);
    assert.strictEqual(wrapper.dive().props().disabled, true);
  });

  it('simulates click events', () => {
    const onButtonClick = spy();
    const wrapper = mount(<Button onClick={onButtonClick} />);
    wrapper.find('button').simulate('click');
    expect(onButtonClick).to.have.property('callCount', 1);
  });

  it('should label be "UpperCase" format with allowLabelCase=false', () => {
    const wrapper = shallow(<Button text="aaa" allowLabelCase={false} />);
    assert.strictEqual(wrapper.dive().instance().getLabel(), 'AAA');
  });

  it('should label be empty with allowLabelCase=false and text is null', () => {
    const wrapper = shallow(<Button text={null} allowLabelCase={false} />);
    assert.strictEqual(wrapper.dive().instance().getLabel(), '');
  });

  it('should assign textPosition', () => {
    const wrapper = mount((
      <Button
        text="click"
        textPosition="right" />
    ));
    let muiButton = wrapper.find(MuiButton);
    assert.strictEqual(muiButton.props().style.justifyContent, 'flex-end');
    wrapper.setProps({ textPosition: 'left' });
    muiButton = wrapper.find(MuiButton);
    assert.strictEqual(muiButton.props().style.justifyContent, 'left');
  });
});
