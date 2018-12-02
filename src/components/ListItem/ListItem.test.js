import React from 'react';
import { mount } from 'enzyme';
import ListItem from './ListItem';
import context from '../../../test/utils/context';

describe('<ListItem /> tests', () => {
  it('should mount', () => {
    mount(<ListItem context={context} />);
  });
});
