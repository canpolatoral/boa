import React from 'react';
import { mount } from 'enzyme';
import { expect, assert } from 'chai';
import { spy, useFakeTimers } from 'sinon'; // eslint-disable-line
import InputNumeric from './InputNumeric';
import context from '../../../test/utils/context';

describe('<InputNumeric /> tests', () => {
  it('should mount', () => {
    mount(<InputNumeric context={context} />);
  });

  it('should mount RTL', () => {
    context.languageId = 5;
    context.localization.isRightToLeft = true;
    mount(<InputNumeric context={context} />);
  });

  it('should component will receive props', () => {
    const wrapper = mount(<InputNumeric context={context} />);
    wrapper.setProps({ value: 10 });
    expect(wrapper.instance().getValue()).equals(10);
    wrapper.setProps({ value: 20 });
    expect(wrapper.instance().getValue()).equals(20);
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
});
