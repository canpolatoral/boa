import React from 'react';
import { mount } from 'enzyme';
import InputAction from './InputAction';
import context from '../../../test/utils/context';

describe('<InputAction /> tests', () => {
  it('should mount', () => {
    mount(<InputAction context={context} />);
  });

  it('should mount RTL', () => {
    context.languageId = 5;
    context.localization.isRightToLeft = true;
    mount(<InputAction context={context} />);
  });
});
