import React from 'react';
import { assert } from 'chai';
import { spy } from 'sinon';
import Resizer from './resizer';
import { createShallow, createMount } from '@boa/test/utils';

describe('<Resizer />', () => {
  let mount;
  let shallow;

  before(() => {
    mount = createMount();
    shallow = createShallow();
  });

  after(() => {
    mount.cleanUp();
  });

  it('should render a div', () => {
    const wrapper = shallow(<Resizer className="test" />);
    assert.strictEqual(wrapper.type(), 'div');
    assert.strictEqual(wrapper.hasClass('test'), true);
  });

  it('should handle onTouchStart', () => {
    const onResizeStart = spy();
    const wrapper = shallow(<Resizer className="test" onResizeStart={onResizeStart} />);
    wrapper.simulate('touchStart');
    assert.strictEqual(onResizeStart.callCount, 1);
  });

  it('should handle onMouseDown', () => {
    const onResizeStart = spy();
    const wrapper = shallow(<Resizer className="test" onResizeStart={onResizeStart} />);
    wrapper.simulate('mouseDown');
    assert.strictEqual(onResizeStart.callCount, 1);
  });

  it('should override styles', () => {
    const wrapper = shallow(<Resizer replaceStyles={{ margin: 10 }} />);
    assert.strictEqual(wrapper.props().style.margin, 10);
    assert.strictEqual(Object.keys(wrapper.props().style).length, 1);
  });
});
