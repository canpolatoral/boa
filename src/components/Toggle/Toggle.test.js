import React from 'react';
import { mount, shallow } from 'enzyme';
import { spy } from 'sinon';
import { assert, expect } from 'chai';
import Toggle from './Toggle';
import context from '../../../test/utils/context';

describe('<Toggle /> tests', () => {
  it('should mount', () => {
    mount(<Toggle context={context} />);
  });

  it('simulates click events (onCheck)', () => {
    const onToggle = spy();
    const wrapper = mount((
      <Toggle
        onToggle={onToggle}
        defaultChecked={false}
        context={context}
        label="test" />
    ));
    wrapper.find('input').simulate('change', { target: { checked: true } });
    expect(onToggle).to.have.property('callCount', 1);
  });

  it('should setValue, getValue, resetValue', () => {
    const wrapper = shallow(<Toggle context={context} />).dive();
    const input = wrapper.shallow();
    assert.strictEqual(input.instance().getValue(), false);
    input.instance().setValue(true);
    assert.strictEqual(input.instance().getValue(), true);
    input.instance().resetValue();
    assert.strictEqual(input.instance().getValue(), false);
  });
});
