import React from 'react';
import { assert } from 'chai';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import ErrorBoundary from './ErrorBoundary';
import AppProvider from './AppProvider';
import getTheme from './theme';
import { createShallow, createMount } from '../../test/utils';

describe('<AppProvider />', () => {
  let shallow;
  let mount;

  before(() => {
    shallow = createShallow({ includeBOAcontext: false });
    mount = createMount({ includeBOAcontext: false });
  });

  after(() => {
    mount.cleanUp();
  });

  it('it should have an error boundary', () => {
    const wrapper = shallow(<AppProvider>Test</AppProvider>);
    assert.strictEqual(wrapper.type(), ErrorBoundary);
  });

  it('it should have ThemeProvider child', () => {
    const wrapper = shallow(<AppProvider>Test</AppProvider>);
    assert.strictEqual(wrapper.childAt(0).type(), MuiThemeProvider);
  });

  it('it should have CssBaseline inside ThemeProvider', () => {
    const wrapper = shallow(<AppProvider>Test</AppProvider>);
    assert.strictEqual(wrapper.childAt(0).childAt(0).type(), CssBaseline);
  });

  it('should mount without theme', () => {
    const wrapper = mount(<AppProvider><div>test</div></AppProvider>);
    assert.strictEqual(wrapper.find('div').text(), 'test');
  });

  it('should mount with theme', () => {
    const theme = getTheme({ themeName: 'violet' });
    const wrapper = mount(<AppProvider theme={theme}><div>test</div></AppProvider>);
    assert.strictEqual(wrapper.find('div').text(), 'test');
  });
});
