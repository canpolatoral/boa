import React from 'react';
import LinearPanel from './LinearPanel';
import { context, createMount } from '../../../test/utils';

describe('<LinearPanel /> tests', () => {
  let mount;

  before(() => {
    mount = createMount();
  });

  after(() => {
    mount.cleanUp();
  });

  it('should mount', () => {
    mount(<LinearPanel context={context} />);
  });
});
