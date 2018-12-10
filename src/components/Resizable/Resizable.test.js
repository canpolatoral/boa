import React from 'react';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import { assert } from 'chai';
import Resizable from './Resizable';
import context from '../../../test/utils/context';

describe('<Resizable /> tests', () => {
  it('should mount', () => {
    mount((
      <Resizable
        context={context}
        lockAspectRatio
        bounds="parent"
        minWidth={200}
        minHeight={100}
        default={{ x: 0, y: 0, width: '100%', height: '100%' }}>
        <div>test</div>
      </Resizable>
    ));
  });

  it('should resize', () => {
    const wrapper = mount((
      <Resizable
        context={context}
        lockAspectRatio
        bounds="parent"
        minWidth={200}
        minHeight={100}
        default={{ x: 0, y: 0, width: '100%', height: '100%' }}>
        <div>test</div>
      </Resizable>
    ));
    wrapper.instance().updateSize({ width: 10, height: 10 });
  });

  it('should call dragStart, dragStop', () => {
    const onDragStart = spy();
    const onDragStop = spy();

    const wrapper = mount((
      <Resizable
        context={context}
        onDragStart={onDragStart}
        onDragStop={onDragStop}
        lockAspectRatio
        bounds="parent"
        minWidth={200}
        minHeight={100}
        default={{ x: 0, y: 0, width: '100%', height: '100%' }}>
        <div>test</div>
      </Resizable>
    ));
    wrapper.simulate('mouseDown');
    wrapper.simulate('mouseUp');

    assert.strictEqual(onDragStart.callCount, 1);
    assert.strictEqual(onDragStop.callCount, 1);
  });
});
