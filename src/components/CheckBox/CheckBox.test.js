import React from 'react';
import { assert } from 'chai';
import { shallow, mount } from 'enzyme';
import CheckBox from './CheckBox';
import MuiCheckbox from '@material-ui/core/Checkbox';
import context from '../../../test/utils/context';


describe('<CheckBox /> tests', () => {
  it('should render a <MuiCheckbox> element', () => {
    const wrapper = shallow(<CheckBox context={context} checked />).dive();
    assert.strictEqual(wrapper.shallow().type(), MuiCheckbox);
  });

  it('should mount', () => {
    mount(<CheckBox context={context} checked />);
  });

  it('should mount with label', () => {
    mount(<CheckBox context={context} label="test" />);
  });
});
