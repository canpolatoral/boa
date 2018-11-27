import React from 'react';
import { mount } from 'enzyme';
import { assert, expect } from 'chai';
import EditorBase from './EditorBase';
import Context from '../../test/utils/context';

/* eslint-disable-next-line */
class EmptyComponent extends EditorBase {

  /* eslint-disable-next-line */
  getValue() {
    return this.props.value;
  }

  render() {
    return (
      <div>
        {this.getValue()}
      </div>
    );
  }
}

describe('<EditorBase /> tests', () => {
  let wrapper;

  before(() => {
    wrapper = mount(<EmptyComponent context={Context} />);
  });

  it('should valid when empty props', () => {
    const result = wrapper.instance().validateConstraint();
    assert.strictEqual(result, true);
  });

  it('should valid when isVisible false', () => {
    wrapper.setProps({ isVisible: false });
    const result = wrapper.instance().validateConstraint();
    assert.strictEqual(result, true);
  });

  it('should error when is required', () => {
    wrapper.setProps({
      valueConstraint: { required: true },
      isVisible: true,
    });
    const result = wrapper.instance().validateConstraint();
    assert.strictEqual(result, false);
    const message = wrapper.instance().getMessage('BOA', 'Nullable');
    expect(wrapper.instance().validationResult).to.be.include({ key: 'required', message });
  });

  it('should error when minLength required', () => {
    wrapper.setProps({
      valueConstraint: { minLength: 100 },
      isVisible: true,
      value: 'test',
    });
    const result = wrapper.instance().validateConstraint();
    assert.strictEqual(result, false);
    const message = wrapper.instance().getMessage('BOA', 'MinLength').replace('{0}', 100);
    expect(wrapper.instance().validationResult).to.be.include({ key: 'minLength', message });
  });

  it('should error when maxLength required', () => {
    wrapper.setProps({
      valueConstraint: { maxLength: 1 },
      isVisible: true,
      value: 'test',
    });
    const result = wrapper.instance().validateConstraint();
    assert.strictEqual(result, false);
    const message = wrapper.instance().getMessage('BOA', 'MaxLength').replace('{0}', 1);
    expect(wrapper.instance().validationResult).to.be.include({ key: 'maxLength', message });
  });
});
