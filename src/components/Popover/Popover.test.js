import React from 'react';
import { assert } from 'chai';
import { spy } from 'sinon';
import { Resizable } from '@boa/components/Resizable';
import Popover from './Popover';
import { context, createMount, createShallow } from '../../../test/utils';

describe('<Popover /> tests', () => {
  let mount;
  let shallow;

  before(() => {
    mount = createMount();
    shallow = createShallow();
  });

  after(() => {
    mount.cleanUp();
  });

  it('should mount', () => {
    mount(<Popover context={context} />);
  });

  it('should resizable', () => {
    const onResize = spy();
    const wrapper = shallow((
      <Popover
        onResize={onResize}
        resizable
        context={context}>
        <div>test</div>
      </Popover>
    ));
    const resizable = wrapper.find(Resizable);
    resizable.simulate('mouseUp', { foo: 'foo' });
    // assert.strictEqual(onResize.callCount, 1);
  });

  it('should change open status with instance method', () => {
    const wrapper = mount(<Popover context={context} />);
    wrapper.instance().openPopover();
    assert.strictEqual(wrapper.state().open, true);
    wrapper.instance().openPopover();
    assert.strictEqual(wrapper.state().open, false);
    wrapper.instance().manualOpen();
    assert.strictEqual(wrapper.state().open, true);
    wrapper.instance().manualClose();
    assert.strictEqual(wrapper.state().open, false);
  });
});
