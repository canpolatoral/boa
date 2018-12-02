import React from 'react';
import { mount } from 'enzyme';
import Menu from './Menu';
import context from '../../../test/utils/context';

describe('<Menu /> tests', () => {
  it('should mount', () => {
    mount(<Menu context={context} />);
  });
});
