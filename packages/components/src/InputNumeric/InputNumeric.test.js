import React from 'react';
import { assert } from 'chai';
import { spy, useFakeTimers } from 'sinon'; // eslint-disable-line
import { Input } from '@boa/components/Input';
import InputNumeric from './InputNumeric';
import { context, createMount } from '@boa/test/utils';

describe('<InputNumeric />', () => {
  let mount;

  before(() => {
    mount = createMount();
  });

  after(() => {
    mount.cleanUp();
  });

  it('should render Input', () => {
    const wrapper = mount(<InputNumeric value={12} context={context} />);
    const input = wrapper.find(Input);
    assert.strictEqual('12', input.props().value);
  });

  it('should setValue, getValue, resetValue', () => {
    const wrapper = mount(<InputNumeric context={context} defaultValue={12} />);
    assert.strictEqual(wrapper.instance().getInstance().getValue(), 12);
    wrapper.instance().getInstance().setValue(1234);
    assert.strictEqual(wrapper.instance().getInstance().getValue(), 1234);
    wrapper.instance().getInstance().resetValue();
    assert.strictEqual(wrapper.instance().getInstance().getValue(), 12);
  });

  describe('prop changes', () => {
    it('should change disabled', () => {
      const wrapper = mount(<InputNumeric value={12} context={context} />);
      wrapper.setProps({ disabled: true });
      const input = wrapper.find(Input);
      assert.strictEqual(input.props().disabled, true);
    });

    it('should change value to null', () => {
      const wrapper = mount(<InputNumeric value={12} context={context} />);
      wrapper.setProps({ value: null });
      assert.strictEqual(wrapper.instance().getInstance().getValue(), null);
    });

    it('should change value ', () => {
      const wrapper = mount(<InputNumeric value={12} context={context} />);
      wrapper.setProps({ value: 1234 });
      assert.strictEqual(wrapper.instance().getInstance().getValue(), 1234);
    });

    it('should change caretPosition', () => {
      const wrapper = mount(<InputNumeric value={12345} context={context} />);
      wrapper.setProps({ caretPosition: 1 });
      const input = wrapper.find('input');
      assert.strictEqual(input.getDOMNode().selectionStart, 1);
      assert.strictEqual(input.getDOMNode().selectionEnd, 1);
    });
  });

  it('should support snapshat', () => {
    const wrapper = mount(<InputNumeric value={12} context={context} />);
    const snapshot = wrapper.instance().getInstance().getSnapshot();
    wrapper.setProps({ value: null });
    wrapper.instance().getInstance().setSnapshot(snapshot);
    assert.strictEqual(wrapper.instance().getInstance().getValue(), 12);
  });

  it('should disable with instance method', () => {
    const wrapper = mount(<InputNumeric value={12} context={context} />);
    wrapper.instance().getInstance().setDisable(true);
    assert.strictEqual(wrapper.state().disabled, true);
  });

  it('should mount RTL', () => {
    const newContext = Object.assign({}, context,
      {
        languageId: 5,
        localization: {
          isRightToLeft: true,
        },
      });
    mount(<InputNumeric context={newContext} />);
  });

  it('should fire event callbacks', () => {
    const events = ['onChange', 'onFocus', 'onBlur', 'onKeyUp', 'onKeyDown'];
    const handlers = events.reduce((result, n) => {
      result[n] = spy();
      return result;
    }, {});

    const wrapper = mount(<InputNumeric defaultValue={1} context={context} {...handlers} />);

    events.forEach(n => {
      const event = n.charAt(2).toLowerCase() + n.slice(3);
      wrapper.find('input').simulate(event);
      assert.strictEqual(handlers[n].callCount, 1, `should have called the ${n} handler`);
    });
  });


  describe('keyboard events', () => {
    it('should handle number', () => {
      const onKeyDown = spy();
      const wrapper = mount(<InputNumeric context={context} onKeyDown={onKeyDown} />);
      wrapper.find('input').simulate('keyDown', {
        keyCode: 49, // keyCode=1
      });
      wrapper.find('input').simulate('change', {
        target: { value: '1' },
      });
      assert.strictEqual(onKeyDown.callCount, 1);
      assert.strictEqual(wrapper.instance().getInstance().getValue(), 1);
    });

    it('should handle numpad number', () => {
      const onKeyDown = spy();
      const wrapper = mount(<InputNumeric context={context} onKeyDown={onKeyDown} />);
      wrapper.find('input').simulate('keyDown', {
        keyCode: 97, // numpad 1
      });
      wrapper.find('input').simulate('change', {
        target: { value: '1' },
      });
      assert.strictEqual(onKeyDown.callCount, 1);
      assert.strictEqual(wrapper.instance().getInstance().getValue(), 1);
    });

    it('should reject string', () => {
      const onKeyDown = spy();
      const wrapper = mount(<InputNumeric context={context} onKeyDown={onKeyDown} />);
      wrapper.find('input').simulate('keyDown', {
        keyCode: 65, // 'a'
      });
      wrapper.find('input').simulate('change', {
        target: { value: 'a' },
      });
      assert.strictEqual(onKeyDown.callCount, 1);
      assert.strictEqual(wrapper.instance().getInstance().getValue(), null);
    });

    it('should handle modifier keys', () => {
      const onKeyDown = spy();
      const wrapper = mount(<InputNumeric context={context} onKeyDown={onKeyDown} />);
      const modifierKeyEvents = [{ shiftKey: true }, { ctrlKey: true }, { altKey: true }];
      modifierKeyEvents.forEach((arg) => {
        onKeyDown.resetHistory();
        wrapper.find('input').simulate('keyDown', arg);
        assert.strictEqual(onKeyDown.callCount, 1);
        assert.strictEqual(wrapper.instance().getInstance().getValue(), null);
        assert.strictEqual(wrapper.instance().getInstance().onKeyDownResult, false);
      });
    });

    it('should handle copy keys', () => {
      const onKeyDown = spy();
      const wrapper = mount(<InputNumeric context={context} onKeyDown={onKeyDown} />);
      const modifierKeyEvents = [
        { ctrlKey: true, keyCode: 67 },
        { metaKey: true, keyCode: 67 },
      ];
      modifierKeyEvents.forEach((arg) => {
        onKeyDown.resetHistory();
        wrapper.find('input').simulate('keyDown', arg);
        assert.strictEqual(onKeyDown.callCount, 1);
        assert.strictEqual(wrapper.instance().getInstance().getValue(), null);
        assert.strictEqual(wrapper.instance().getInstance().onKeyDownResult, true);
      });
    });

    it('should handle focus keys', () => {
      const onKeyDown = spy();
      const wrapper = mount(<InputNumeric context={context} onKeyDown={onKeyDown} />);
      const modifierKeyEvents = [
        { keyCode: 9 }, // tab
        { keyCode: 45 }, // ins
        { keyCode: 35 }, // move
        { keyCode: 36 }, // move
        { keyCode: 37 }, // move
        { keyCode: 39 }, // move
      ];
      modifierKeyEvents.forEach((arg) => {
        onKeyDown.resetHistory();
        wrapper.find('input').simulate('keyDown', arg);
        assert.strictEqual(onKeyDown.callCount, 1);
        assert.strictEqual(wrapper.instance().getInstance().getValue(), null);
        assert.strictEqual(wrapper.instance().getInstance().onKeyDownResult, true);
      });
    });

    it('should handle delete keys', () => {
      const onKeyDown = spy();
      const wrapper = mount((
        <InputNumeric defaultValue={10000} context={context} onKeyDown={onKeyDown} />
      ));
      const modifierKeyEvents = [
        { keyCode: 8, target: { selectionStart: 0, selectionEnd: 0 }, expect: false }, // backspace
        { keyCode: 8, target: { selectionStart: 0, selectionEnd: 1 }, expect: true }, // backspace
        { keyCode: 8, target: { selectionStart: 1, selectionEnd: 0 }, expect: true }, // backspace
      ];
      modifierKeyEvents.forEach((arg) => {
        onKeyDown.resetHistory();
        wrapper.find('input').simulate('keyDown', arg);
        assert.strictEqual(onKeyDown.callCount, 1);
        assert.strictEqual(wrapper.instance().getInstance().onKeyDownResult, arg.expect);
      });
    });
  });
});
