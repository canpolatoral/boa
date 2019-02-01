import React from 'react';
import { spy } from 'sinon';
import { assert } from 'chai';
import TreeView from './TreeView';
import { context, createMount } from '@boa/test/utils';
import { InputAction } from '@boa/components/InputAction';
import { IconButton } from '@boa/components/IconButton';
import sampleData from './data/sampleData';

describe('<TreeView />', () => {
  let mount;
  // let shallow;

  before(() => {
    mount = createMount();
    // shallow = createShallow({ dive: true });
  });

  it('should mount', () => {
    mount((
      <TreeView
        sampleData={sampleData}
        context={context}
      />
    ));
  });

  it('should searchActionButton click', () => {
    const wrapper = mount((
      <TreeView
        sampleData={sampleData}
        context={context}
      />
    ));
    const input = wrapper.find(InputAction);
    const predicate = x => x.props().dynamicIcon === 'Search' && x.type() === IconButton;
    const button = input.findWhere(predicate);
    const instance = wrapper.instance();
    const filterSpy = spy(instance, 'filterTree');
    button.simulate('click', {});
    filterSpy.restore();
    assert.deepEqual(filterSpy.returnValues, [undefined]);
    assert.strictEqual(filterSpy.callCount, 1);
  });
});
