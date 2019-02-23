import React from 'react';
// import Tree from 'react-virtualized-tree';
import { stub } from 'sinon';
// import { assert } from 'chai';
import { InputAction } from '@kuveytturk/boa-components/InputAction';
import TreeView from './TreeView';
// import FilteringContainer from './FilteringContainer';
import { context, createMount } from '@kuveytturk/boa-test/utils';
import sampleData from './data/sampleData';

describe('<TreeView />', () => {
  let mount;
  // let shallow;

  before(() => {
    mount = createMount();
    // shallow = createShallow({ dive: true });
  });

  afterEach(() => {
    mount.cleanUp();
  });

  it('should mount', () => {
    mount(<TreeView sampleData={sampleData} context={context} />);
  });

  it('should search', () => {
    const wrapper = mount(<TreeView sampleData={sampleData} context={context} />);
    const input = wrapper.find(InputAction).first();
    const instance = input.instance();
    const getValueStub = stub(instance, 'getInstance').returns({
      getValue: () => 'gulp',
    });
    wrapper.instance().filteringContainer.search();
    getValueStub.restore();
    // TODO.....
  });
});
