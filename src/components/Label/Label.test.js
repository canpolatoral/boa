import React from 'react';
import { assert } from 'chai';
import Label from './Label';
import { context, createShallow, createMount } from '../../../test/utils';

describe('<Label /> tests', () => {
  let mount;
  let shallow;

  before(() => {
    mount = createMount();
    shallow = createShallow();
  });

  after(() => {
    mount.cleanUp();
  });

  it('should render', () => {
    const wrapper = shallow(<Label context={context} text="Test" />).dive().shallow();
    assert.strictEqual(wrapper.text(), 'Test');
  });

  it('should mount', () => {
    mount(<Label context={context} text="Test" />);
  });
});
