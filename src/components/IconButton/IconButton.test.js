import React from 'react';
import { expect, assert } from 'chai';
import IconButton from './IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ButtonBase from '@material-ui/core/ButtonBase';
import { context, createShallow, createMount } from '../../../test/utils';

describe('<IconButton /> tests', () => {
  let mount;
  let shallow;

  before(() => {
    mount = createMount({ includeBOAcontext: false });
    shallow = createShallow({ includeBOAcontext: false });
  });

  after(() => {
    mount.cleanUp();
  });

  it('should render ButtonBase', () => {
    const wrapper = shallow(<IconButton context={context} />).dive();
    assert.strictEqual(wrapper.shallow().type(), ButtonBase);
  });

  it('should render ButtonBase', () => {
    const wrapper = shallow(<IconButton context={context} tooltip="tooltip" />).dive();
    assert.strictEqual(wrapper.shallow().type(), Tooltip);
    assert.strictEqual(wrapper.shallow().childAt(0).type(), ButtonBase);
  });

  it('should mount', () => {
    mount(<IconButton context={context} />);
  });

  it('should disable with componentWillReceiveProps', () => {
    const wrapper = mount(<IconButton context={context} />);
    wrapper.setProps({ disabled: true });
    expect(wrapper.find(ButtonBase).props().disabled).equals(true);
  });
});
