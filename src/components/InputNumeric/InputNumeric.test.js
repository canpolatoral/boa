import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
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
});
