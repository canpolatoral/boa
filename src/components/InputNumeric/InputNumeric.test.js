import React from 'react';
import { mount } from 'enzyme';
import InputNumeric from './InputNumeric';
import context from '../../../test/utils/context';

describe('<InputNumeric /> tests', () => {
  it('should mount', () => {
    mount(<InputNumeric context={context} />);
  });

  it('should mount RTL', () => {
    context.languageId = 5;
    context.localization.isRightToLeft = true;
    mount(<InputNumeric context={context} />);
  });
});
