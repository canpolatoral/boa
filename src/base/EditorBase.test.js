import React from 'react';
import { assert, expect } from 'chai';
import EditorBase from './EditorBase';
import { context, createMount } from '../../test/utils';

/* eslint-disable-next-line */
class EmptyComponent extends EditorBase {
  render() {
    return (
      <div>
        {this.props.value}
      </div>
    );
  }
}

/* eslint-disable-next-line */
class EmptyComponentWithValue extends EmptyComponent {
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

describe('<EditorBase />', () => {
  let mount;

  before(() => {
    mount = createMount();
  });

  after(() => {
    mount.cleanUp();
  });

  describe('with getValue', () => {
    let wrapper;

    before(() => {
      wrapper = mount(<EmptyComponentWithValue context={context} />);
    });

    it('should valid when empty props', () => {
      const result = wrapper.instance().getInstance().validateConstraint();
      assert.strictEqual(result, true);
    });

    it('should valid when isVisible equals to false', () => {
      wrapper.setProps({ isVisible: false });
      const result = wrapper.instance().getInstance().validateConstraint();
      assert.strictEqual(result, true);
    });

    it('should not valid when value is null and required', () => {
      wrapper.setProps({
        valueConstraint: { required: true },
        isVisible: true,
      });
      const result = wrapper.instance().getInstance().validateConstraint();
      assert.strictEqual(result, false);
      const message = wrapper.instance().getInstance().getMessage('BOA', 'Nullable');
      const validationResult = wrapper.instance().getInstance().validationResult;
      expect(validationResult).to.be.include({ key: 'required', message });
    });

    it('should not valid when value is undefined and required', () => {
      wrapper.setProps({
        valueConstraint: { required: true },
        isVisible: true,
        value: undefined,
      });
      const result = wrapper.instance().getInstance().validateConstraint();
      assert.strictEqual(result, false);
      const message = wrapper.instance().getInstance().getMessage('BOA', 'Nullable');
      const validationResult = wrapper.instance().getInstance().validationResult;
      expect(validationResult).to.be.include({ key: 'required', message });
    });

    it('should not valid when value is empty and required', () => {
      wrapper.setProps({
        valueConstraint: { required: true },
        isVisible: true,
        value: ' ',
      });
      const result = wrapper.instance().getInstance().validateConstraint();
      assert.strictEqual(result, false);
      const message = wrapper.instance().getInstance().getMessage('BOA', 'Nullable');
      const validationResult = wrapper.instance().getInstance().validationResult;
      expect(validationResult).to.be.include({ key: 'required', message });
    });

    it('should valid when value is required', () => {
      wrapper.setProps({
        valueConstraint: { required: true },
        isVisible: true,
        value: 'test',
      });
      const result = wrapper.instance().getInstance().validateConstraint();
      assert.strictEqual(result, true);
    });

    it('should not valid when minLength was given', () => {
      wrapper.setProps({
        valueConstraint: { minLength: 100 },
        isVisible: true,
        value: 'test',
      });
      const result = wrapper.instance().getInstance().validateConstraint();
      assert.strictEqual(result, false);
      const message = wrapper.instance()
        .getInstance()
        .getMessage('BOA', 'MinLength')
        .replace('{0}', 100);
      const validationResult = wrapper.instance().getInstance().validationResult;
      expect(validationResult).to.be.include({ key: 'minLength', message });
    });

    it('should not valid when maxLength was given', () => {
      wrapper.setProps({
        valueConstraint: { maxLength: 1 },
        isVisible: true,
        value: 'test',
      });
      const result = wrapper.instance().getInstance().validateConstraint();
      assert.strictEqual(result, false);
      const message = wrapper.instance()
        .getInstance()
        .getMessage('BOA', 'MaxLength')
        .replace('{0}', 1);
      const validationResult = wrapper.instance().getInstance().validationResult;
      expect(validationResult).to.be.include({ key: 'maxLength', message });
    });

    it('should valid when minLength and maxLength were given', () => {
      wrapper.setProps({
        valueConstraint: { minLength: 1, maxLength: 10 },
        isVisible: true,
        value: 'test',
      });
      const result = wrapper.instance().getInstance().validateConstraint();
      assert.strictEqual(result, true);
    });
  });

  describe('without getValue', () => {
    let wrapper;

    before(() => {
      wrapper = mount(<EmptyComponent context={context} />);
    });

    it('should valid when empty props', () => {
      const result = wrapper.instance().getInstance().validateConstraint();
      assert.strictEqual(result, true);
    });

    it('should valid when isVisible equals to false', () => {
      wrapper.setProps({ isVisible: false });
      const result = wrapper.instance().getInstance().validateConstraint();
      assert.strictEqual(result, true);
    });

    it('should not valid when value is required', () => {
      wrapper.setProps({
        valueConstraint: { required: true },
        isVisible: true,
      });
      const result = wrapper.instance().getInstance().validateConstraint();
      assert.strictEqual(result, false);
    });

    it('should valid when minLength was given', () => {
      wrapper.setProps({
        valueConstraint: { minLength: 100 },
        isVisible: true,
        value: 'test',
      });
      const result = wrapper.instance().getInstance().validateConstraint();
      assert.strictEqual(result, true);
    });

    it('should valid when maxLength was given', () => {
      wrapper.setProps({
        valueConstraint: { maxLength: 1 },
        isVisible: true,
        value: 'test',
      });
      const result = wrapper.instance().getInstance().validateConstraint();
      assert.strictEqual(result, true);
    });
  });
});
