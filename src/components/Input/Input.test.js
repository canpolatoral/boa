import React from 'react';
import { expect, assert } from 'chai';
import { spy, useFakeTimers } from 'sinon'; // eslint-disable-line
import { EditorBase } from '@boa/base';
import { IconButton } from '@boa/components/IconButton';
import MuiInput from '@material-ui/core/Input';
import MuiInputLabel from '@material-ui/core/InputLabel';
import MuiFormControl from '@material-ui/core/FormControl';
import Input from './Input';
import { context, createShallow, createMount } from '../../../test/utils';

describe('<Input /> tests', () => {
  let mount;
  let shallow;

  before(() => {
    mount = createMount();
    shallow = createShallow();
  });

  after(() => {
    mount.cleanUp();
  });

  it('should extends EditorBase', () => {
    const wrapper = shallow(<Input context={context} />).dive();
    wrapper.is(EditorBase);
  });

  it('shuld render a div', () => {
    const wrapper = shallow(<Input context={context} />).dive();
    assert.strictEqual(wrapper.dive().name(), 'div');
  });

  it('shuld render a MuiFormControl inside the div', () => {
    const wrapper = shallow(<Input context={context} />).dive();
    const control = wrapper.dive().find(MuiFormControl);
    assert.strictEqual(control.shallow().name(), 'FormControl');
  });

  it('shuld render a MuiInputLabel inside the FormControl', () => {
    const wrapper = shallow(<Input floatingLabelText="test" context={context} />).dive();
    const control = wrapper.dive().find(MuiFormControl);
    const input = control.shallow().find(MuiInputLabel);
    assert.strictEqual(input.shallow().name(), 'InputLabel');
    assert.strictEqual(input.shallow().props().children, 'test');
  });

  it('shuld render a MuiInput inside the FormControl', () => {
    const wrapper = shallow(<Input defaultValue="test" context={context} />).dive();
    const control = wrapper.dive().find(MuiFormControl);
    const input = control.shallow().find(MuiInput);
    assert.strictEqual(input.shallow().name(), 'Input');
    assert.strictEqual(input.shallow().props().value, 'test');
  });

  it('should mount with defaultValue', () => {
    const wrapper = mount(<Input context={context} defaultValue="testDefaultValue" />);
    expect(wrapper.find('input').props().value).equals('testDefaultValue');
  });

  it('should mount with value', () => {
    const wrapper = mount(<Input context={context} value="testValue" />);
    expect(wrapper.find('input').props().value).equals('testValue');
  });

  it('should render a disabled <input />', () => {
    const wrapper = shallow(<Input context={context} disabled />).dive();
    const control = wrapper.dive().find(MuiFormControl);
    const input = control.shallow().find(MuiInput);
    assert.strictEqual(input.shallow().name(), 'Input');
    assert.strictEqual(input.shallow().props().disabled, true);
  });

  it('should mount RTL', () => {
    const newContext = Object.assign({}, context,
      {
        languageId: 5,
        localization: {
          isRightToLeft: true,
        },
      });
    mount(<Input context={newContext} />);
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

  it('should setValue, getValue, resetValue', () => {
    const wrapper = shallow(<Input context={context} defaultValue="test" />).dive();
    const input = wrapper.dive();
    assert.strictEqual(input.instance().getInstance().getValue(), 'test');
    input.instance().getInstance().setValue('test-new');
    assert.strictEqual(input.instance().getInstance().getValue(), 'test-new');
    input.instance().getInstance().resetValue();
    assert.strictEqual(input.instance().getInstance().getValue(), 'test');
  });

  it('should setDisable', () => {
    const wrapper = shallow(<Input context={context} defaultValue="test" />).dive();
    const input = wrapper.dive();
    input.instance().getInstance().setDisable(true);
    assert.strictEqual(input.state().disabled, true);
  });

  it('should fire counter event', () => {
    const onTimerFinished = spy();
    const clock = useFakeTimers(new Date());
    mount((
      <Input
        onTimerFinished={onTimerFinished}
        context={context}
        timerDuration={5}
        showCounter />
    ));
    clock.tick(6000);
    assert.strictEqual(onTimerFinished.callCount,
      1, 'should have called the onTimerFineshed handler');
    clock.restore();
  });

  describe('prop changes', () => {
    it('should change timerDuration', () => {
      const onTimerFinished = spy();
      const wrapper = mount((
        <Input
          onTimerFinished={onTimerFinished}
          context={context}
          timerDuration={3}
          showCounter />
      ));
      const clock = useFakeTimers(new Date());
      wrapper.setProps({ timerDuration: 10 });
      clock.tick(11000);
      assert.strictEqual(onTimerFinished.callCount,
        1, 'should have called the onTimerFineshed handler');
      clock.restore();
    });

    it('should change disabled', () => {
      const wrapper = mount(<Input context={context} />);
      wrapper.setProps({ disabled: true });
      const input = wrapper.find(MuiInput);
      assert.strictEqual(input.props().disabled, true);
    });

    it('should change textSelection', () => {
      const wrapper = mount(<Input value="hello" context={context} />);
      wrapper.setProps({ textSelection: { start: 1, end: 2 } });
      const input = wrapper.find('input');
      assert.strictEqual(input.getDOMNode().selectionStart, 1);
      assert.strictEqual(input.getDOMNode().selectionEnd, 2);
    });
  });

  describe('prop:clearButton', () => {
    it('should render clear buton', () => {
      const wrapper = mount(<Input context={context} value="test" showClearButton />);
      const button = wrapper.find(IconButton);
      assert.strictEqual(button.props().dynamicIcon, 'Close');
    });

    it('should onClick clear buton', () => {
      const onChange = spy();
      const wrapper = mount(
        <Input
          context={context}
          onChange={onChange}
          value="test"
          showClearButton />);

      const button = wrapper.find(IconButton);
      button.simulate('click');
      assert.strictEqual(onChange.callCount, 1);
      assert.strictEqual(wrapper.instance().getInstance().getValue(), '');
    });
  });
});
