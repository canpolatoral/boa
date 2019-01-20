import React from 'react';
import { expect } from 'chai';
import { Button } from '@boa/components/Button';
import CalendarActionButtons from './CalendarActionButtons';
import { context, createShallow, createMount } from '@boa/test/utils';

describe('<CalendarActionButtons />', () => {
  let shallow;
  let mount;

  before(() => {
    shallow = createShallow();
    mount = createMount();
  });

  after(() => {
    mount.cleanUp();
  });

  it('should mount', () => {
    mount(<CalendarActionButtons context={context} />);
  });

  it('should contains two button', () => {
    const wrapper = shallow(
      <CalendarActionButtons cancelLabel="cancel" okLabel="ok" autoOk={false} context={context} />,
    );
    const cancelButton = wrapper.find(Button).at(0);
    const okButton = wrapper.find(Button).at(1);
    expect(cancelButton.props().text).to.equals('cancel');
    expect(okButton.props().text).to.equals('ok');
  });

  it('should swap buttons when RTL', () => {
    const newContext = Object.assign({}, context, {
      languageId: 5,
      localization: {
        isRightToLeft: true,
      },
    });
    const wrapper = shallow(
      <CalendarActionButtons
        cancelLabel="cancel"
        okLabel="ok"
        autoOk={false}
        context={newContext}
      />,
    );
    const cancelButton = wrapper.find(Button).at(1);
    const okButton = wrapper.find(Button).at(0);
    expect(cancelButton.props().text).to.equals('cancel');
    expect(okButton.props().text).to.equals('ok');
  });
});
