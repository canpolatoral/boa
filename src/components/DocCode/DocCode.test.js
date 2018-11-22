import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import DocCode from './DocCode';

const DocCodeFixture = <DocCode content="console.log('Hello world');" lang="js" />;

describe('<DocCode /> tests', () => {
  it('should render a <DocCode> element', () => {
    const wrapper = shallow(DocCodeFixture);
    expect(wrapper.html()).contains('<code class="hljs">');
  });

  it('should mount', () => {
    mount(DocCodeFixture);
  });
});
