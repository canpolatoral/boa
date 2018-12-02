import React from 'react';
import { mount } from 'enzyme';
import Popover from './Popover';
import context from '../../../test/utils/context';

describe('<Popover /> tests', () => {
  it('should mount', () => {
    mount(<Popover context={context} />);
  });
});
