import React from 'react';
import DocViewer from './DocViewer';
import content from './test/doc';
import { createMount } from '../../../test/utils';

describe('<DocViewer /> tests', () => {
  let mount;

  before(() => {
    mount = createMount();
  });

  after(() => {
    mount.cleanUp();
  });

  it('should mount', () => {
    mount(<DocViewer content={content} />);
  });
});
