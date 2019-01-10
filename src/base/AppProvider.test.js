import React from 'react';
import AppProvider from './AppProvider';
import getTheme from './theme';
import { createMount } from '../../test/utils';

describe('<AppProvider />', () => {
  let mount;

  before(() => {
    mount = createMount({ includeBOAcontext: false });
  });

  after(() => {
    mount.cleanUp();
  });

  it('should mount without theme', () => {
    mount(<AppProvider>Test</AppProvider>);
  });

  it('should mount with theme', () => {
    const theme = getTheme({ themeName: 'violet' });
    mount(<AppProvider theme={theme}>Test</AppProvider>);
  });
});
