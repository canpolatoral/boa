import React from 'react';
import { AppProvider } from '@boa/base';
import DateTimePicker from './DateTimePicker';
import { context, createMount } from '@boa/test/utils';

describe('<DateTimePicker />', () => {
  let mount;

  before(() => {
    mount = createMount();
  });

  afterEach(() => {
    mount.cleanUp();
  });

  it('should mount', () => {
    const wrapper = mount(
      <AppProvider theme={context.theme}>
        <DateTimePicker context={context} />
      </AppProvider>,
    );
    const dateInput = wrapper.find('input').first();
    dateInput.simulate('focus');
  });
});
