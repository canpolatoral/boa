import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import Input from './Input';
import { EditorBase } from '@boa/base';
import context from '../../../test/utils/context';

describe('<Input /> tests', () => {
  it('should extends EditorBase', () => {
    const wrapper = shallow(<Input context={context} />).dive();
    wrapper.is(EditorBase);
  });

  it('should mount', () => {
    mount(<Input context={context} />);
  });

  it('should mount RTL', () => {
    context.languageId = 5;
    context.localization.isRightToLeft = true;
    mount(<Input context={context} />);
  });

  it('should render with defaultValue', () => {
    const wrapper = mount(<Input context={context} defaultValue="testDefaultValue" />);
    expect(wrapper.find('input').props().value).equals('testDefaultValue');
  });

  it('should render with value', () => {
    const wrapper = mount(<Input context={context} value="testValue" />);
    expect(wrapper.find('input').props().value).equals('testValue');
  });
});
