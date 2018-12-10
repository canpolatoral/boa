import React from 'react';
import { mount, shallow } from 'enzyme';
import { assert } from 'chai';
import { spy, useFakeTimers } from 'sinon'; // eslint-disable-line
import InputAction from './InputAction';
import context from '../../../test/utils/context';

describe('<InputAction /> tests', () => {
  it('should mount', () => {
    mount(<InputAction context={context} />);
  });

  it('should mount RTL', () => {
    context.languageId = 5;
    context.localization.isRightToLeft = true;
    mount(<InputAction context={context} />);
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
});
