import React from 'react';
import { shallow, mount } from 'enzyme';
import { assert } from 'chai';
import Label from './Label';
import Context from '../../../test/utils/context';

describe('<Label /> tests', () => {
  it('should render', () => {
    const wrapper = shallow(<Label context={Context} text="Test" />).dive().shallow();
    assert.strictEqual(wrapper.text(), 'Test');
  });

  it('should mount', () => {
    mount(<Label context={Context} text="Test" />);
  });
});
