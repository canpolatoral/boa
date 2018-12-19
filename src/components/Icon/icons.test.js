import React from 'react';
import { mount } from 'enzyme';
import * as Icons from './icons';

describe('Icons tests', () => {
  it('should mount all icons', () => {
    Object.keys(Icons).forEach((key) => {
      Object.keys(Icons[key]).forEach((subKey) => {
        const RenderedIcon = Icons[key][subKey];
        mount(<RenderedIcon />);
      });
    });
  });
});
