import React from 'react';
import { mount } from 'enzyme';
import DocViewer from './DocViewer';
import content from './test/doc';

describe('<DocViewer /> tests', () => {
  it('should mount', () => {
    mount(<DocViewer content={content} />);
  });
});
