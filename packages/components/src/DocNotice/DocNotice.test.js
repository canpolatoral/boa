import React from 'react';
import { expect } from 'chai';
import { AppProvider } from '@boa/base';
import * as SvgIcons from '@material-ui/icons';
import DocNotice from './DocNotice';
import { context, createShallow, createMount } from '@boa/test/utils';

describe('<DocNotice />', () => {
  let mount;
  let shallow;

  before(() => {
    mount = createMount();
    shallow = createShallow();
  });

  after(() => {
    mount.cleanUp();
  });

  it('should render info', () => {
    const wrapper = shallow((
      <DocNotice context={context} content="info" header="info" type="info" />
    ));
    expect(wrapper.find(AppProvider).childAt(0).type()).to.equals(SvgIcons.Info);
    expect(wrapper.text()).contains('info : info');
  });

  it('should render warning', () => {
    const wrapper = shallow((
      <DocNotice context={context} content="warning" header="warning" type="warning" />
    ));
    expect(wrapper.find(AppProvider).childAt(0).type()).to.equals(SvgIcons.Warning);
    expect(wrapper.text()).contains('warning : warning');
  });

  it('should render error', () => {
    const wrapper = shallow((
      <DocNotice context={context} content="error" header="error" type="error" />
    ));
    expect(wrapper.find(AppProvider).childAt(0).type()).to.equals(SvgIcons.Error);
    expect(wrapper.text()).contains('error : error');
  });

  it('should render tip', () => {
    const wrapper = shallow((
      <DocNotice context={context} content="tip" header="tip" type="tip" />
    ));
    expect(wrapper.find(AppProvider).childAt(0).type()).to.equals(SvgIcons.Star);
    expect(wrapper.text()).contains('tip : tip');
  });

  it('should mount', () => {
    mount(<DocNotice context={context} />);
  });

  it('should mount when fitMode ', () => {
    mount(<DocNotice context={context} fitMode />);
  });
});
