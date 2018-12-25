import React from 'react';
import Menu from './Menu';
import { context, createMount } from '../../../test/utils';

describe('<Menu /> tests', () => {
  let mount;

  before(() => {
    mount = createMount();
  });

  after(() => {
    mount.cleanUp();
  });

  it('should mount', () => {
    mount(<Menu context={context} />);
  });
});
