import React from 'react';
import { assert } from 'chai';
import { Input } from '@boa/components/Input';
import InputMask from './InputMask';
import { context, createMount } from '../../../test/utils';

describe('<InputMask /> tests', () => {
  let mount;

  before(() => {
    mount = createMount();
  });

  after(() => {
    mount.cleanUp();
  });

  it('should render Input', () => {
    const wrapper = mount(<InputMask mask="aa nn" value="1234" context={context} />);
    const input = wrapper.find(Input);
    assert.strictEqual('1234', input.props().value);
  });
});
