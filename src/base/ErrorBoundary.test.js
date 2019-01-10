import React, { Component } from 'react';
import { expect } from 'chai';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import ErrorBoundary from './ErrorBoundary';
import { createShallow, createMount } from '../../test/utils';

/* eslint-disable-next-line */
class BasicComponent extends Component {
  render() {
    throw new Error('BasicComponent Error');
  }
}

describe('<ErrorBoundary />', () => {
  let shallow;
  let mount;

  before(() => {
    shallow = createShallow({ includeBOAcontext: false });
    mount = createMount({ includeBOAcontext: false });
  });

  after(() => {
    mount.cleanUp();
  });

  it('should render child when no error', () => {
    const wrapper = mount((
      <ErrorBoundary>
        <div>
          ErrorBoundaryTest
        </div>
      </ErrorBoundary>
    ));
    expect(wrapper.text()).contains('ErrorBoundaryTest');
  });

  it('should render error', () => {
    const wrapper = shallow((
      <ErrorBoundary>
        <div>
          ErrorBoundaryTest
        </div>
      </ErrorBoundary>
    ));
    wrapper.setState({ hasError: true, open: true, error: { message: 'ErrorMessage' } });
    const dialog = wrapper.find(DialogTitle).shallow();
    expect(dialog.props()).to.have.property('children', 'ErrorMessage');
  });

  it('should handle close', () => {
    const wrapper = shallow((
      <ErrorBoundary>
        <div>
          ErrorBoundaryTest
        </div>
      </ErrorBoundary>
    ));
    wrapper.setState({ hasError: true, open: true, error: { message: 'ErrorMessage' } });
    wrapper.find(Button).simulate('click');
    expect(wrapper.state()).to.have.property('open', false);
  });
});
