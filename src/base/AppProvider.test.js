import React from 'react';
import { mount } from 'enzyme';
import AppProvider from './AppProvider';
import getTheme from './theme';

describe('<AppProvider /> tests', () => {
  it('should mount without theme', () => {
    mount(<AppProvider>Test</AppProvider>);
  });

  it('should mount with theme', () => {
    const theme = getTheme({ themeName: 'violet' });
    mount(<AppProvider theme={theme}>Test</AppProvider>);
  });
});
