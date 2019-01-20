import React from 'react';
import { assert } from 'chai';
import { Button } from '@boa/components/Button';
import { Input } from '@boa/components/Input';
import LinearPanel from './LinearPanel';
import { context, createMount } from '@boa/test/utils';

describe('<LinearPanel />', () => {
  let mount;

  before(() => {
    mount = createMount();
  });

  after(() => {
    mount.cleanUp();
  });

  it('should mount', () => {
    const wrapper = mount(
      <LinearPanel context={context}>
        <Button context={context} />
        <Input context={context} />
      </LinearPanel>,
    );
    const button = wrapper.find(Button);
    const input = wrapper.find(Input);
    assert.strictEqual(button.props().disabled, false);
    assert.strictEqual(input.props().disabled, false);
  });

  it('should disabled', () => {
    const wrapper = mount(
      <LinearPanel context={context}>
        <Button context={context} />
        <Input context={context} />
      </LinearPanel>,
    );
    wrapper.setProps({ disabled: true });
    const button = wrapper.find(Button);
    const input = wrapper.find(Input);
    assert.strictEqual(button.props().disabled, true);
    assert.strictEqual(input.props().disabled, true);
  });

  it('should support vertical orientation by default ', () => {
    const wrapper = mount(
      <LinearPanel context={context}>
        <Button context={context} />
        <Input context={context} />
      </LinearPanel>,
    );
    const div = wrapper.find('div').first();
    assert.strictEqual(div.props().style.flexDirection, 'column');
  });

  it('should support horizontal orientation ', () => {
    const wrapper = mount(
      <LinearPanel context={context} orientation="horizontal">
        <Button context={context} />
        <Input context={context} />
      </LinearPanel>,
    );
    const div = wrapper.find('div').first();
    assert.strictEqual(div.props().style.flexDirection, 'row');
  });
});
