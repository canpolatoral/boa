import React from 'react';
import { assert } from 'chai';
import MuiDivider from '@material-ui/core/Divider';
import Divider from './Divider';
import { createShallow, createMount } from '../../../test/utils';

describe('<Divider /> tests', () => {
  let shallow;
  let mount;

  before(() => {
    shallow = createShallow({ dive: true });
    mount = createMount();
  });

  after(() => {
    mount.cleanUp();
  });

  it('should render a <MuiDivider> element', () => {
    const wrapper = shallow(<Divider />);
    assert.strictEqual(wrapper.type(), MuiDivider);
  });

  it('should mount', () => {
    mount(<Divider />);
  });
});
