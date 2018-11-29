import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import { AppProvider } from '@boa/base';
import * as SvgIcons from '@material-ui/icons';
import DocNotice from './DocNotice';
import Context from '../../../test/utils/context';

describe('<DocNotice /> tests', () => {
  it('should render info', () => {
    const wrapper = shallow((
      <DocNotice context={Context} content="info" header="info" type="info" />
    ));
    expect(wrapper.find(AppProvider).childAt(0).type(), SvgIcons.Info);
    expect(wrapper.text()).contains('info : info');
  });

  it('should render warning', () => {
    const wrapper = shallow((
      <DocNotice context={Context} content="warning" header="warning" type="warning" />
    ));
    expect(wrapper.find(AppProvider).childAt(0).type(), SvgIcons.Warning);
    expect(wrapper.text()).contains('warning : warning');
  });

  it('should render error', () => {
    const wrapper = shallow((
      <DocNotice context={Context} content="error" header="error" type="error" />
    ));
    expect(wrapper.find(AppProvider).childAt(0).type(), SvgIcons.Error);
    expect(wrapper.text()).contains('error : error');
  });

  it('should render tip', () => {
    const wrapper = shallow((
      <DocNotice context={Context} content="tip" header="tip" type="tip" />
    ));
    expect(wrapper.find(AppProvider).childAt(0).type(), SvgIcons.Star);
    expect(wrapper.text()).contains('tip : tip');
  });

  it('should mount', () => {
    mount(<DocNotice context={Context} />);
  });
});
