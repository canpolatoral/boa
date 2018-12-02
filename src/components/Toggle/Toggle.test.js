import React from 'react';
import { mount } from 'enzyme';
import Toggle from './Toggle';
import context from '../../../test/utils/context';

describe('<Toggle /> tests', () => {
  it('should mount', () => {
    mount(<Toggle context={context} />);
  });
});
