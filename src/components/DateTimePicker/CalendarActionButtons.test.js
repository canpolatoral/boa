import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import { Button } from '@boa/components/Button';
import CalendarActionButtons from './CalendarActionButtons';
import context from '../../../test/utils/context';

describe('<CalendarActionButtons /> tests', () => {
  it('should mount', () => {
    mount(<CalendarActionButtons context={context} />);
  });

  it('should contains two button', () => {
    const wrapper = shallow((
      <CalendarActionButtons
        cancelLabel="cancel"
        okLabel="ok"
        autoOk={false}
        context={context} />));
    const cancelButton = wrapper.find(Button).at(0);
    const okButton = wrapper.find(Button).at(1);
    expect(cancelButton.props().text).to.equals('cancel');
    expect(okButton.props().text).to.equals('ok');
  });

  it('should swap buttons when RTL', () => {
    context.languageId = 5;
    context.localization.isRightToLeft = true;
    const wrapper = shallow((
      <CalendarActionButtons
        cancelLabel="cancel"
        okLabel="ok"
        autoOk={false}
        context={context} />));
    const cancelButton = wrapper.find(Button).at(1);
    const okButton = wrapper.find(Button).at(0);
    expect(cancelButton.props().text).to.equals('cancel');
    expect(okButton.props().text).to.equals('ok');
    context.languageId = 1;
    context.localization.isRightToLeft = false;
  });
});
