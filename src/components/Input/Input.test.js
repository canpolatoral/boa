import React from 'react';
import { expect, assert } from 'chai';
import { shallow, mount } from 'enzyme';
import Input from './Input';
import { EditorBase } from '@boa/base';
import { spy } from 'sinon';
import MuiInput from '@material-ui/core/Input';
import MuiInputLabel from '@material-ui/core/InputLabel';
import MuiFormControl from '@material-ui/core/FormControl';
import context from '../../../test/utils/context';

describe('<Input /> tests', () => {
  it('should extends EditorBase', () => {
    const wrapper = shallow(<Input context={context} />).dive();
    wrapper.is(EditorBase);
  });

  it('shuld render a div', () => {
    const wrapper = shallow(<Input context={context} />).dive();
    assert.strictEqual(wrapper.shallow().name(), 'div');
  });

  it('shuld render a MuiFormControl inside the div', () => {
    const wrapper = shallow(<Input context={context} />).dive();
    const control = wrapper.shallow().find(MuiFormControl);
    assert.strictEqual(control.shallow().name(), 'FormControl');
  });

  it('shuld render a MuiInputLabel inside the FormControl', () => {
    const wrapper = shallow(<Input floatingLabelText="test" context={context} />).dive();
    const control = wrapper.shallow().find(MuiFormControl);
    const input = control.shallow().find(MuiInputLabel);
    assert.strictEqual(input.shallow().name(), 'InputLabel');
    assert.strictEqual(input.shallow().props().children, 'test');
  });

  it('shuld render a MuiInput inside the FormControl', () => {
    const wrapper = shallow(<Input defaultValue="test" context={context} />).dive();
    const control = wrapper.shallow().find(MuiFormControl);
    const input = control.shallow().find(MuiInput);
    assert.strictEqual(input.shallow().name(), 'Input');
    assert.strictEqual(input.shallow().props().value, 'test');
  });

  it('should render with defaultValue', () => {
    const wrapper = mount(<Input context={context} defaultValue="testDefaultValue" />);
    expect(wrapper.find('input').props().value).equals('testDefaultValue');
  });

  it('should render with value', () => {
    const wrapper = mount(<Input context={context} value="testValue" />);
    expect(wrapper.find('input').props().value).equals('testValue');
  });

  it('should render a disabled <input />', () => {
    const wrapper = shallow(<Input context={context} disabled />).dive();
    const control = wrapper.shallow().find(MuiFormControl);
    const input = control.shallow().find(MuiInput);
    assert.strictEqual(input.shallow().name(), 'Input');
    assert.strictEqual(input.shallow().props().disabled, true);
  });

  it('should mount', () => {
    mount(<Input context={context} />);
  });

  it('should mount RTL', () => {
    context.languageId = 5;
    context.localization.isRightToLeft = true;
    mount(<Input context={context} />);
  });

  it('should fire event callbacks', () => {
    const events = ['onChange', 'onFocus', 'onBlur', 'onKeyUp', 'onKeyDown'];
    const handlers = events.reduce((result, n) => {
      result[n] = spy();
      return result;
    }, {});

    const wrapper = mount(<Input defaultValue="test" context={context} {...handlers} />);

    events.forEach(n => {
      const event = n.charAt(2).toLowerCase() + n.slice(3);
      wrapper.find('input').simulate(event);
      assert.strictEqual(handlers[n].callCount, 1, `should have called the ${n} handler`);
    });
  });
});
