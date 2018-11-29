import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import DocCode from './DocCode';

describe('<DocCode /> tests', () => {
  it('should mount', () => {
    const wrapper = mount(<DocCode content="console.log('Hello world');" />);
    const className = wrapper.getDOMNode().querySelector('code').className;
    expect(className).to.equals('hljs');
  });

  it('should mount with lang', () => {
    mount(<DocCode content="console.log('Hello world');" lang="js" />);
  });

  it('should mount with highlight', () => {
    mount(<DocCode content="console.log('Hello world');" highlight />);
  });

  it('should mount without highlight', () => {
    mount(<DocCode content="console.log('Hello world');" highlight={false} />);
  });
});
