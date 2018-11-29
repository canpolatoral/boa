import React from 'react';
import { mount } from 'enzyme';
import IconComposer from './IconComposer';
import * as SvgIcons from '@material-ui/icons';

describe('<IconComposer /> tests', () => {
  it('should mount', () => {
    const Composer = IconComposer(SvgIcons.Home);
    mount(<Composer nativeColor="#ffffff" />);
  });
});
