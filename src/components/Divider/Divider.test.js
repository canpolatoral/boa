import React from 'react';
import { assert } from 'chai';
import { shallow, mount } from 'enzyme';
import Divider from './Divider';
import MuiDivider from '@material-ui/core/Divider';

describe('<Divider /> tests', () => {
  it('should render a <MuiDivider> element', () => {
    const wrapper = shallow(<Divider />).dive();
    assert.strictEqual(wrapper.type(), MuiDivider);
  });

  it('should mount', () => {
    mount(<Divider />);
  });
});
