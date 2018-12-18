import React from 'react';
import { AppProvider } from '@boa/base';
import DateTimePicker from './DateTimePicker';
import Context from '../../../test/utils/context';
import { createMount } from '../../../test/utils';

describe('<DateTimePicker /> tests', () => {
  let mount;

  before(() => {
    mount = createMount();
  });

  it('should mount', () => {
    const wrapper = mount((
      <AppProvider theme={context.theme}><DateTimePicker context={Context} /></AppProvider>
    ));
    const dateInput = wrapper.find('input').first();
    dateInput.simulate('focus');
  });
});
