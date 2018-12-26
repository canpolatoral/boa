import React from 'react';
import { assert } from 'chai';
import { stub } from 'sinon';
import MuiDialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { Button } from '@boa/components/Button';
import Dialog from './Dialog';
import DialogHelper from './DialogHelper';
import { context, createShallow } from '../../../test/utils';

describe('<Dialog /> tests', () => {
  let shallow;

  before(() => {
    shallow = createShallow();
  });

  it('should render a <MuiDialog> element', () => {
    const wrapper = shallow(<Dialog context={context} open={false} />);
    assert.strictEqual(wrapper.dive().type(), MuiDialog);
  });

  it('should handle prop changes', () => {
    const wrapper = shallow(<Dialog context={context} open />);
    wrapper.setProps({ open: false, title: 'test' });
    assert.strictEqual(wrapper.state().open, false);
    assert.strictEqual(wrapper.state().title, 'test');
    assert.strictEqual(wrapper.dive().shallow().props().open, false);
  });

  it('should show and change header', () => {
    const wrapper = shallow((
      <Dialog
        context={context}
        title="test"
        titleWithCloseButtonEnabled
        open
        showHeader />
    ));
    let title = wrapper.dive().find(MuiDialogTitle);
    assert.strictEqual(title.childAt(0).text(), 'test');
    wrapper.instance().setTitle('test-title');
    title = wrapper.find(MuiDialogTitle);
    assert.strictEqual(title.childAt(0).text(), 'test-title');
  });

  it('should show left title button', () => {
    const wrapper = shallow((
      <Dialog
        context={context}
        title="test"
        titleWithCloseButtonEnabled
        open
        showHeader />
    ));

    const leftButton = (
      <Button
        context={context}
        type="icon"
        style={{ width: 40, height: 40 }}
        dynamicIcon={'ArrowBack'}
        iconProperties={{ nativeColor: '#FFF' }} />
    );

    wrapper.instance().setLeftTitleButton(leftButton);
    const title = wrapper.find(MuiDialogTitle);
    // double dive to child inside of a div
    assert.strictEqual(title.childAt(0).childAt(0).type(), Button);
    assert.strictEqual(title.childAt(0).childAt(0).type(), Button);
    assert.strictEqual(title.childAt(0).childAt(0).props().dynamicIcon, 'ArrowBack');
  });

  it('should change status with open method', () => {
    const wrapper = shallow(<Dialog context={context} open dialogKey="dialogKey" />);
    const clearRefs = stub(DialogHelper, 'clearRefs');
    wrapper.instance().open(false);
    assert.strictEqual(wrapper.state().open, false);
    assert.strictEqual(clearRefs.callCount, 1);
    clearRefs.restore();
  });
});
