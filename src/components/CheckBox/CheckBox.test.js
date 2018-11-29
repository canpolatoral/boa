import React from 'react';
import { assert, expect } from 'chai';
import { shallow, mount } from 'enzyme';
import CheckBox from './CheckBox';
import MuiCheckbox from '@material-ui/core/Checkbox';
import { Label } from '@boa/components/Label';
import context from '../../../test/utils/context';
import sinon from 'sinon';


describe('<CheckBox /> tests', () => {
  it('should render a <MuiCheckbox> element', () => {
    const wrapper = shallow(<CheckBox context={context} checked />).dive();
    assert.strictEqual(wrapper.shallow().type(), MuiCheckbox);
  });

  it('should mount', () => {
    mount(<CheckBox context={context} checked />);
  });

  it('should mount with label', () => {
    mount(<CheckBox context={context} label="test" />);
  });

  it('should getValue returns checked status', () => {
    const wrapper = mount(<CheckBox context={context} label="test" />);
    expect(wrapper.instance().innerRef.getValue(), false);
  });

  it('should setValue change the checked status', () => {
    const wrapper = mount(<CheckBox context={context} label="test" />);
    wrapper.instance().innerRef.setValue(true);
    const mui = wrapper.find(MuiCheckbox);
    expect(mui.props().checked, true);
    expect(wrapper.instance().innerRef.getValue(), true);
  });

  it('should change disabled prop', () => {
    const wrapper = mount(<CheckBox context={context} label="test" />);
    wrapper.instance().innerRef.setDisable(true);
    const mui = wrapper.find(MuiCheckbox);
    expect(mui.props().disabled, true);
  });

  it('should reset value', () => {
    const wrapper = mount(<CheckBox defaultChecked={false} context={context} label="test" />);
    wrapper.instance().innerRef.resetValue();
  });

  it('simulates click events (onCheck)', () => {
    const onCheck = sinon.spy();
    const wrapper = mount((
      <CheckBox
        onCheck={onCheck}
        defaultChecked={false}
        context={context}
        label="test" />
    ));
    wrapper.find('input').simulate('change', { target: { checked: true } });
    expect(onCheck).to.have.property('callCount', 1);
  });

  it('simulates click events (onChange)', () => {
    const onChange = sinon.spy();
    const wrapper = mount((
      <CheckBox
        onChange={onChange}
        defaultChecked={false}
        context={context}
        label="test" />
    ));
    wrapper.find('input').simulate('change', { target: { checked: true } });
    expect(onChange).to.have.property('callCount', 1);
  });

  it('should render errorText', () => {
    const wrapper = mount((
      <CheckBox
        context={context}
        errorText="ErrorText"
        errorTextVisible
        label="test" />
    ));
    const label = wrapper.find(Label);
    expect(label.text()).contains('ErrorText');
  });

  it('should handle componentWillReceiveProps', () => {
    const wrapper = mount((
      <CheckBox
        context={context}
        errorText="ErrorText"
        errorTextVisible
        label="test" />
    ));
    wrapper.setProps({ checked: true });
    let mui = wrapper.find(MuiCheckbox);
    expect(mui.props().checked).to.equals(true);
    wrapper.setProps({ disabled: true });
    mui = wrapper.find(MuiCheckbox);
    expect(mui.props().disabled).to.equals(true);
    wrapper.setProps({ defaultChecked: false });
    mui = wrapper.find(MuiCheckbox);
    expect(mui.props().checked).to.equals(false);
    wrapper.setProps({ disabled: false });
    mui = wrapper.find(MuiCheckbox);
    expect(mui.props().disabled).to.equals(false);
  });
});
