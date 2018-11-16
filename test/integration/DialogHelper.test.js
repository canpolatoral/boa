import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import DialogHelperFixture from './fixtures/Dialog/DialogHelper';
import context from '../utils/context';

describe('<DialogHelperFixture> integration', () => {
  it('should open when click the button', () => {
    const onButtonClick = sinon.spy();
    const wrapper = mount(<DialogHelperFixture context={context} onClick={onButtonClick} />);
    wrapper.find('button').simulate('click');
    expect(onButtonClick).to.have.property('callCount', 1);
  });
});
