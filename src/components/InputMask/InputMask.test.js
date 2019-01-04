import React from 'react';
import { assert } from 'chai';
import { spy } from 'sinon'; // eslint-disable-line
import { Input } from '@boa/components/Input';
import InputMask from './InputMask';
import PredefinedMask from './constants';
import { context, createMount } from '../../../test/utils';

describe('<InputMask /> tests', () => {
  let mount;

  before(() => {
    mount = createMount();
  });

  after(() => {
    mount.cleanUp();
  });

  it('shouldd render Input', () => {
    const wrapper = mount(<InputMask mask="aa nn" value="1234" context={context} />);
    const input = wrapper.find(Input);
    assert.strictEqual('1234', input.props().value);
  });

  it('should render PredefinedMask', () => {
    const wrapper = mount(<InputMask context={context} />);
    Object.keys(PredefinedMask.Type).forEach((type) => {
      wrapper.setProps({ type });
    });
  });

  it('should change disable', () => {
    const wrapper = mount(<InputMask context={context} />);
    wrapper.setProps({ disabled: true });
  });

  it('should getValue', () => {
    const wrapper = mount(<InputMask context={context} />);
    wrapper.instance().getInstance().getValue();
  });

  it('should resetValue', () => {
    const wrapper = mount(<InputMask context={context} />);
    wrapper.instance().getInstance().resetValue();
  });

  it('should fire event callbacks', () => {
    const events = ['onChange', 'onFocus', 'onBlur'];
    const handlers = events.reduce((result, n) => {
      result[n] = spy();
      return result;
    }, {});

    const wrapper = mount(<InputMask context={context} {...handlers} />);

    events.forEach(n => {
      const event = n.charAt(2).toLowerCase() + n.slice(3);
      wrapper.find('input').simulate(event);
      assert.strictEqual(handlers[n].callCount, 1, `should have called the ${n} handler`);
    });
  });
});
