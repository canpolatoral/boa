import React from 'react';
import { mount } from 'enzyme';
import LinearPanel from './LinearPanel';
import context from '../../../test/utils/context';

describe('<LinearPanel /> tests', () => {
  it('should mount', () => {
    mount(<LinearPanel context={context} />);
  });
});
