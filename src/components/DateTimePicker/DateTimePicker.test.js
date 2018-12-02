import React from 'react';
import { mount } from 'enzyme';
import DateTimePicker from './DateTimePicker';
import Context from '../../../test/utils/context';
import { AppProvider } from '@boa/base';

describe('<DateTimePicker /> tests', () => {
  it('should mount', () => {
    const wrapper = mount((
      <AppProvider theme={context.theme}><DateTimePicker context={Context} /></AppProvider>
    ));
    const dateInput = wrapper.find('input').first();
    dateInput.simulate('focus');
  });
});
