// import React from 'react';
// import { assert, expect } from 'chai';
// import { shallow, mount } from 'enzyme';
// import sinon from 'sinon';
// import { AppProvider } from '@boa/base';
// import CheckBox from './CheckBox';
// import MuiCheckBox from '@material-ui/core/CheckBox';
// import context from '../../../test/utils/context';

// describe('<CheckBox /> tests', () => {
//   it('should render a <MuiCheckBox> element', () => {
//     const wrapper = shallow(<CheckBox context={context} checked />, { context });
//     const checkBox = wrapper.first().shallow();
//     // assert.strictEqual(wrapper.dive().dive().type(), MuiCheckBox);
//   });

//   // it('should mount', () => {
//   //   mount(<CheckBox checked />);
//   // });

//   // it('should render a button with type="contained" by default', () => {
//   //   const wrapper = shallow(<Button label="click" />)
//   //     .first()
//   //     .shallow();
//   //   assert.strictEqual(wrapper.name(), 'Button');
//   //   assert.strictEqual(wrapper.props().type, 'contained');
//   // });

//   // it('should change type to flat', () => {
//   //   const wrapper = shallow(<Button type="flat" label="click" />)
//   //     .first()
//   //     .shallow();
//   //   assert.strictEqual(wrapper.name(), 'Button');
//   //   assert.strictEqual(wrapper.props().type, 'flat');
//   // });

//   // it('should change type to icon', () => {
//   //   const wrapper = shallow(<Button type="icon" dynamicIcon="Home" label="click" />)
//   //     .first()
//   //     .shallow()
//   //     .first()
//   //     .shallow();
//   //   assert.strictEqual(wrapper.childAt(0).type(), SvgIcons.Home);
//   // });

//   // it('should render a dynamicIcon', () => {
//   //   const wrapper = shallow(<Button label="click" dynamicIcon="Home" />)
//   //     .first()
//   //     .shallow()
//   //     .first()
//   //     .shallow();
//   //   assert.strictEqual(wrapper.childAt(0).type(), SvgIcons.Home);
//   // });

//   // it('should mount', () => {
//   //   mount(<Button />);
//   // });

//   // it('calls componentDidMount', () => {
//   //   sinon.spy(Button.prototype, 'componentDidMount');
//   //   mount(<Button />);
//   //   expect(Button.prototype.componentDidMount).to.have.property('callCount', 1);
//   // });

//   // it('simulates click events', () => {
//   //   const onButtonClick = sinon.spy();
//   //   const wrapper = mount(<Button onClick={onButtonClick} />);
//   //   wrapper.find('button').simulate('click');
//   //   expect(onButtonClick).to.have.property('callCount', 1);
//   // });
// });
