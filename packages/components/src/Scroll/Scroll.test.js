import React from 'react';
import { assert } from 'chai';
import Scroll from './Scroll';
import { context, createMount } from '@boa/test/utils';
import { Platforms } from '@boa/base';

describe('<Scroll />', () => {
  let mount;

  before(() => {
    mount = createMount();
  });

  after(() => {
    mount.cleanUp();
  });

  it('should mount', () => {
    mount(
      <Scroll context={context} option={{ suppressScrollX: true }}>
        <div key="parent">
          <div key="test">test</div>
          <div key="test2">test2</div>
        </div>
      </Scroll>,
    );
  });

  it('shuold be disabled', () => {
    const wrapper = mount(
      <Scroll context={context} option={{ suppressScrollX: true }}>
        <div key="parent">
          <div key="test">test</div>
          <div key="test2">test2</div>
        </div>
      </Scroll>,
    );
    wrapper.setProps({ disabled: true });
    assert.strictEqual(wrapper.state().disabled, true);
  });

  describe('platforms', () => {
    it('should mount on MOBILE and TABLET', () => {
      const newContext = Object.assign({}, context);
      [Platforms.MOBILE, Platforms.TABLET].forEach((item) => {
        newContext.platform = item;
        const wrapper = mount(
          <Scroll context={newContext} option={{ suppressScrollX: true }}>
            <div key="parent">
              <div key="test">test</div>
              <div key="test2">test2</div>
            </div>
          </Scroll>,
        );
        const div = wrapper.find('div').first();
        assert.strictEqual(div.props().style.overflow, 'auto');
        assert.strictEqual(div.props().style.WebkitOverflowScrolling, 'touch');
        const innerDiv = div.childAt(0);
        assert.strictEqual(innerDiv.props().style.direction, 'ltr');
      });
    });

    it('should handle RTL', () => {
      const newContext = Object.assign({}, context);
      [Platforms.MOBILE, Platforms.TABLET].forEach((item) => {
        newContext.platform = item;
        newContext.localization = { isRightToLeft: true };
        const wrapper = mount(
          <Scroll context={newContext} option={{ suppressScrollX: true }}>
            <div key="parent">
              <div key="test">test</div>
              <div key="test2">test2</div>
            </div>
          </Scroll>,
        );
        const div = wrapper.find('div').first();
        assert.strictEqual(div.props().style.overflow, 'auto');
        assert.strictEqual(div.props().style.WebkitOverflowScrolling, 'touch');
        assert.strictEqual(div.props().style.direction, 'rtl');
        const innerDiv = div.childAt(0);
        assert.strictEqual(innerDiv.props().style.direction, 'ltr');
      });
    });

    it('should handle DESKTOP', () => {
      const wrapper = mount(
        <Scroll context={context} option={{ suppressScrollX: true }}>
          <div key="parent">
            <div key="test">test</div>
            <div key="test2">test2</div>
          </div>
        </Scroll>,
      );
      const div = wrapper.find('div').first();
      assert.strictEqual(div.props().style.overflow, 'auto');
      assert.strictEqual(div.hasClass('scrollbar-container'), true);
      const innerDiv = div.childAt(0);
      assert.strictEqual(innerDiv.props().style.direction, 'ltr');
    });

    it('should handle RTL on DESKTOP', () => {
      const newContext = Object.assign({}, context);
      newContext.localization = { isRightToLeft: true };
      const wrapper = mount(
        <Scroll context={newContext} option={{ suppressScrollX: true }}>
          <div key="parent">
            <div key="test">test</div>
            <div key="test2">test2</div>
          </div>
        </Scroll>,
      );
      const div = wrapper.find('div').first();
      assert.strictEqual(div.props().style.direction, 'rtl');
      assert.strictEqual(div.hasClass('scrollbar-container'), true);
    });
  });
});
