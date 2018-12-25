import React from 'react';
import InputMask from './InputMask';
import { context, createMount } from '../../../test/utils';

describe('<InputMask /> tests', () => {
  let mount;

  before(() => {
    mount = createMount();
  });

  after(() => {
    mount.cleanUp();
  });

  it('should mount', () => {
    mount(<InputMask context={context} />);
  });

  it('should mount RTL', () => {
    context.languageId = 5;
    context.localization.isRightToLeft = true;
    mount(<InputMask context={context} />);
  });
});
