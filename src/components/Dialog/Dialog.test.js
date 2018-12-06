import React from 'react';
import { assert } from 'chai';
import { shallow } from 'enzyme';
// import sinon from 'sinon';
import Dialog from './Dialog';
import context from '../../../test/utils/context';
import MuiDialog from '@material-ui/core/Dialog';
// import MuiDialogTitle from '@material-ui/core/DialogTitle';

describe('<Dialog /> tests', () => {
  it('should render a <MuiDialog> element', () => {
    const wrapper = shallow(<Dialog context={context} open={false} />).dive();
    assert.strictEqual(wrapper.type(), MuiDialog);
  });

  it('should component will receive props', () => {
    const wrapper = shallow(<Dialog context={context} open />);
    wrapper.setProps({ open: false });
    assert.strictEqual(wrapper.state().open, false);
  });
});
