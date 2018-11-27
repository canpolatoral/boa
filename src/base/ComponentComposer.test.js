import React from 'react';
import { mount } from 'enzyme';
import { expect, assert } from 'chai';
import ComponentComposer from './ComponentComposer';

/* eslint-disable-next-line */
class EmptyComponent extends React.Component {
  render() {
    return (
      <div>
        EmptyComponent
      </div>
    );
  }
}

describe('<ComponentComposer /> tests', () => {
  it('should mount with WrappedComponent', () => {
    const Compose = ComponentComposer(EmptyComponent);
    const wrapper = mount(<Compose />);
    expect(wrapper.text()).contains('EmptyComponent');
  });

  it('should return null when props.isVisible false', () => {
    const Compose = ComponentComposer(EmptyComponent);
    const wrapper = mount(<Compose isVisible={false} />);
    assert.isTrue(wrapper.isEmptyRender());
  });

  it('should getInstance equals own instance when component did not compose withStyles', () => {
    const Compose = ComponentComposer(EmptyComponent);
    const wrapper = mount(<Compose />);
    assert.strictEqual(wrapper.instance().getInstance(), wrapper.instance());
  });
});
