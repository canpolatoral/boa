import React from 'react';
import ListItem from './ListItem';
import { context, createMount } from '../../../test/utils';

describe('<ListItem />', () => {
  let mount;

  before(() => {
    mount = createMount();
  });

  after(() => {
    mount.cleanUp();
  });

  it('should mount', () => {
    mount(<ListItem context={context} />);
  });
});
