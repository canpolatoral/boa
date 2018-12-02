import React from 'react';
import { mount } from 'enzyme';
import MenuItem from './MenuItem';
import context from '../../../test/utils/context';

describe('<MenuItem /> tests', () => {
  it('should mount', () => {
    mount(<MenuItem context={context} />);
  });
});
