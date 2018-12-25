import React from 'react';
import Popover from './Popover';
import { context, createMount } from '../../../test/utils';

describe('<Popover /> tests', () => {
  let mount;

  before(() => {
    mount = createMount();
  });

  after(() => {
    mount.cleanUp();
  });

  it('should mount', () => {
    mount(<Popover context={context} />);
  });
});
