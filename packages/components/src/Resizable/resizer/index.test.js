import React from 'react';
import { assert } from 'chai';
import { stub } from 'sinon';
import InnerResizable from '.';
import { createMount } from '@boa/test/utils';

describe('<InnerResizable />', () => {
  let mount;

  before(() => {
    mount = createMount();
  });

  after(() => {
    mount.cleanUp();
  });

  it('should render a div', () => {
    const wrapper = mount(<InnerResizable lockAspectRatio />);
    assert.strictEqual(wrapper.type(), InnerResizable);
  });

  it('should change width', () => {
    const wrapper = mount(<InnerResizable lockAspectRatio />);
    wrapper.setProps({ width: 100 });
    assert.strictEqual(wrapper.state().width, 100);
  });

  it('should change height', () => {
    const wrapper = mount(<InnerResizable lockAspectRatio />);
    wrapper.setProps({ height: 100 });
    assert.strictEqual(wrapper.state().height, 100);
  });

  it('should attach window events', () => {
    const events = ['mouseup', 'mousemove', 'touchmove', 'touchend'];
    let count = 0;
    const addEventStub = stub(window, 'addEventListener').callsFake((key) => {
      if (events.includes(key)) {
        count++;
      }
    });
    const wrapper = mount(<InnerResizable lockAspectRatio />);
    wrapper.unmount();
    addEventStub.restore();
    assert.strictEqual(count, 4);
  });

  it('should detach window events', () => {
    const events = ['mouseup', 'mousemove', 'touchmove', 'touchend'];
    let count = 0;
    const removeEventStub = stub(window, 'removeEventListener').callsFake((key) => {
      if (events.includes(key)) {
        count++;
      }
    });
    const wrapper = mount(<InnerResizable lockAspectRatio />);
    wrapper.unmount();
    removeEventStub.restore();
    assert.strictEqual(count, 4);
  });
});
