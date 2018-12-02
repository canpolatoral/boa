import React from 'react';
import { mount } from 'enzyme';
import InputMask from './InputMask';
import context from '../../../test/utils/context';

describe('<InputMask /> tests', () => {
  it('should mount', () => {
    mount(<InputMask context={context} />);
  });

  it('should mount RTL', () => {
    context.languageId = 5;
    context.localization.isRightToLeft = true;
    mount(<InputMask context={context} />);
  });
});
