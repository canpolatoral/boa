import React from 'react';
import { stub, useFakeTimers } from 'sinon';
import { assert } from 'chai';
import { InputAction } from '@kuveytturk/boa-components/InputAction';
import TreeView from './TreeView';
// import FilteringContainer from './FilteringContainer';
import { context, createMount } from '@kuveytturk/boa-test/utils';
import sampleData from './data/sampleData';

describe('<TreeView />', () => {
  let mount;
  // let shallow;

  before(() => {
    mount = createMount();
    // shallow = createShallow({ dive: true });
  });

  afterEach(() => {
    mount.cleanUp();
  });

  it('should mount', () => {
    mount(<TreeView data={sampleData} context={context} />);
  });

  describe('FilteringContainer', () => {
    it('should render a input action', () => {
      const wrapper = mount(<TreeView data={sampleData} context={context} />);
      wrapper.instance().filteringContainer.setState({ filterTerm: null });
      wrapper.update();
      let input = wrapper.find(InputAction).first();
      assert.strictEqual(input.props().value, '');
      wrapper.instance().filteringContainer.setState({ filterTerm: 'gulp' });
      wrapper.update();
      input = wrapper.find(InputAction).first();
      assert.strictEqual(input.props().value, 'gulp');
    });

    it('should search', () => {
      const wrapper = mount(<TreeView data={sampleData} context={context} />);
      const input = wrapper.find(InputAction).first();
      const instance = input.instance();
      const getValueStub = stub(instance, 'getInstance').returns({
        getValue: () => 'gulp',
      });
      wrapper.instance().filteringContainer.search();
      getValueStub.restore();
      assert.strictEqual(wrapper.find('p').text(), '2 BOA.TreeviewItemFound');
    });

    it('should search with click', () => {
      const wrapper = mount(<TreeView data={sampleData} context={context} />);
      const input = wrapper.find(InputAction).first();
      const button = wrapper.find('button');
      const instance = input.instance();
      const getValueStub = stub(instance, 'getInstance').returns({
        getValue: () => 'gulp',
      });
      button.simulate('click');
      getValueStub.restore();
      assert.strictEqual(wrapper.find('p').text(), '2 BOA.TreeviewItemFound');
    });

    it('should search async with key down', () => {
      const clock = useFakeTimers(new Date());
      const wrapper = mount(<TreeView data={sampleData} context={context} />);
      const input = wrapper.find(InputAction).first();
      const instance = input.instance();
      const getValueStub = stub(instance, 'getInstance').returns({
        getValue: () => 'gulp',
      });
      input.find('input').simulate('keyDown', { keyCode: 40 });
      clock.tick(1000);
      getValueStub.restore();
      assert.strictEqual(wrapper.find('p').text(), '2 BOA.TreeviewItemFound');
    });

    it('should search with enter key down immediately', () => {
      const wrapper = mount(<TreeView data={sampleData} context={context} />);
      const input = wrapper.find(InputAction).first();
      const instance = input.instance();
      const getValueStub = stub(instance, 'getInstance').returns({
        getValue: () => 'gulp',
      });
      input.find('input').simulate('keyDown', { keyCode: 13 });
      getValueStub.restore();
      assert.strictEqual(wrapper.find('p').text(), '2 BOA.TreeviewItemFound');
    });

    it('should clear search', () => {
      const wrapper = mount(<TreeView data={sampleData} context={context} />);
      const input = wrapper.find(InputAction).first();
      const instance = input.instance();
      const getValueStub = stub(instance, 'getInstance').returns({
        getValue: () => 'gulp',
      });
      wrapper.instance().filteringContainer.search();
      wrapper.update();
      getValueStub.restore();
      const button = wrapper.find('button').last();
      button.simulate('click');
      assert.strictEqual(wrapper.find('p').text(), '1 BOA.TreeviewItemSelected');
    });
  });
});
