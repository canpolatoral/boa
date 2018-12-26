import React from 'react';
import { assert } from 'chai';
import { spy, useFakeTimers } from 'sinon'; // eslint-disable-line
// import { IconButton } from '@boa/components/IconButton';
import { Input } from '@boa/components/Input';
import { InputNumeric } from '@boa/components/InputNumeric';
import InputAction from './InputAction';
import { context, createShallow, createMount } from '../../../test/utils';

describe('<InputAction /> tests', () => {
  let mount;
  let shallow;

  before(() => {
    mount = createMount();
    shallow = createShallow();
  });

  after(() => {
    mount.cleanUp();
  });

  it('should render Input', () => {
    const wrapper = mount(<InputAction value="test" context={context} />);
    const input = wrapper.find(Input);
    assert.strictEqual('test', input.props().value);
  });

  it('should render InputNumeric', () => {
    const wrapper = mount(<InputAction type="numeric" value={10} context={context} />);
    const input = wrapper.find(InputNumeric);
    assert.strictEqual(10, input.props().value);
  });

  it('should mount RTL', () => {
    const newContext = Object.assign({}, context,
      {
        languageId: 5,
        localization: {
          isRightToLeft: true,
        },
      });
    mount(<InputAction context={newContext} />);
  });

  it('should fire event callbacks', () => {
    const events = ['onChange', 'onFocus', 'onBlur', 'onKeyUp', 'onKeyDown'];
    const handlers = events.reduce((result, n) => {
      result[n] = spy();
      return result;
    }, {});

    const wrapper = mount(<InputAction defaultValue="test" context={context} {...handlers} />);

    events.forEach(n => {
      const event = n.charAt(2).toLowerCase() + n.slice(3);
      wrapper.find('input').simulate(event);
      assert.strictEqual(handlers[n].callCount, 1, `should have called the ${n} handler`);
    });
  });

  it('should setValue, getValue, resetValue', () => {
    const wrapper = mount(<InputAction context={context} defaultValue="test" />);
    assert.strictEqual(wrapper.instance().getValue(), 'test');
    wrapper.instance().setValue('test-new');
    assert.strictEqual(wrapper.instance().getValue(), 'test-new');
    wrapper.instance().resetValue();
    assert.strictEqual(wrapper.instance().getValue(), 'test');
  });

  it('should setDisable', () => {
    const wrapper = shallow(<InputAction context={context} defaultValue="test" />);
    wrapper.instance().setDisable(true);
    assert.strictEqual(wrapper.state().disabled, true);
  });

  describe('prop changes', () => {
    it('should change disabled', () => {
      const wrapper = mount(<InputAction context={context} defaultValue="test" />);
      wrapper.setProps({ disabled: true });
      const input = wrapper.find(Input);
      assert.strictEqual(input.props().disabled, true);
    });

    it('should change value', () => {
      const wrapper = mount(<InputAction context={context} defaultValue="test" />);
      wrapper.setProps({ value: 'new-value' });
      const input = wrapper.find(Input);
      assert.strictEqual(input.props().value, 'new-value');
    });

    it('should change inputDisabled', () => {
      const wrapper = mount(<InputAction context={context} defaultValue="test" />);
      wrapper.setProps({ inputDisabled: true });
      const input = wrapper.find(Input);
      assert.strictEqual(input.props().disabled, true);
    });

    it('should change leftIconList', () => {
      const wrapper = mount(<InputAction context={context} defaultValue="test" />);
      wrapper.setProps({
        leftIconList: [
          { key: 'alarmAction', dynamicIcon: 'AlarmOn' },
          { key: 'clearAction', dynamicIcon: 'Clear' },
        ],
      });
    });
  });

  describe('actions', () => {
    describe('left icons', () => {
      it('should render left icons', () => {
        mount((
          <InputAction
            context={context}
            rightIconList={[
              { key: 'alarmAction', dynamicIcon: 'AlarmOn' },
              { key: 'clearAction', dynamicIcon: 'Clear' },
            ]}
            defaultValue="test" />
        ));
        // const iconButtons = wrapper.find(IconButton);
      });
    });

    describe('left icons', () => {
      it('should render left icons', () => {
      });
    });
  });

  describe('instance methods', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = mount(
        <InputAction
          context={context}
          rightIconList={[
            { key: 'alarmAction', dynamicIcon: 'AlarmOn' },
            { key: 'clearAction', dynamicIcon: 'Clear' },
          ]}
          leftIconList={[
            { key: 'alarmAction', dynamicIcon: 'AlarmOn' },
            { key: 'clearAction', dynamicIcon: 'Clear' },
          ]}
          defaultValue="test" />);
    });

    it('should hide left icons', () => {
      wrapper.instance().hideLeftIcons();
    });

    it('should show left icons', () => {
      wrapper.instance().showLeftIcons();
    });

    it('should hide right icons', () => {
      wrapper.instance().hideRightIcons();
    });

    it('should show riht icons', () => {
      wrapper.instance().showRightIcons();
    });
  });
});
