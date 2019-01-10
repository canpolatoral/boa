import React from 'react';
import MenuItem from './MenuItem';
import { context, createMount } from '../../../test/utils';

describe('<MenuItem />', () => {
  let mount;

  before(() => {
    mount = createMount();
  });

  after(() => {
    mount.cleanUp();
  });

  it('should mount', () => {
    mount(<MenuItem context={context} />);
  });
});
