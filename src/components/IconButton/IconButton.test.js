import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect, assert } from 'chai';
import IconButton from './IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Context from '../../../test/utils/context';
import ButtonBase from '@material-ui/core/ButtonBase';

describe('<IconButton /> tests', () => {
  it('should render ButtonBase', () => {
    const wrapper = shallow(<IconButton context={Context} />).dive();
    assert.strictEqual(wrapper.shallow().type(), ButtonBase);
  });

  it('should render ButtonBase', () => {
    const wrapper = shallow(<IconButton context={Context} tooltip="tooltip" />).dive();
    assert.strictEqual(wrapper.shallow().type(), Tooltip);
    assert.strictEqual(wrapper.shallow().childAt(0).type(), ButtonBase);
  });

  it('should mount', () => {
    mount(<IconButton context={Context} />);
  });

  it('should disable with componentWillReceiveProps', () => {
    const wrapper = mount(<IconButton context={Context} />);
    wrapper.setProps({ disabled: true });
    expect(wrapper.find(ButtonBase).props().disabled).equals(true);
  });
});
