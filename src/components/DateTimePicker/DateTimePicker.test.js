import React from 'react';
import { AppProvider } from '@boa/base';
import DateTimePicker from './DateTimePicker';
import { context, createMount } from '../../../test/utils';

describe('<DateTimePicker />', () => {
  let mount;

  before(() => {
    mount = createMount();
  });

  after(() => {
    mount.cleanUp();
  });

  it('should mount', () => {
    const wrapper = mount((
      <AppProvider theme={context.theme}><DateTimePicker context={context} /></AppProvider>
    ));
    const dateInput = wrapper.find('input').first();
    dateInput.simulate('focus');
  });
});
