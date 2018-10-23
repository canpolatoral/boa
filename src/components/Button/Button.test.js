import React from 'react';
import { assert } from 'chai';
import enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Button from './Button';
import MuiButton from '@material-ui/core/Button';
import * as SvgIcons from '@material-ui/icons';


enzyme.configure({ adapter: new Adapter() });

describe('<Button /> tests', () => {
  it('should render a button with type="raised" by default', () => {
    const wrapper = shallow(<Button label='click' />).first().shallow();
    assert.strictEqual(wrapper.name(), 'Button');
    assert.strictEqual(wrapper.props().type, 'raised');
  });

  it('should change type to flat', () => {
    const wrapper = shallow(<Button type='flat' label='click' />).first().shallow();
    assert.strictEqual(wrapper.name(), 'Button');
    assert.strictEqual(wrapper.props().type, 'flat');
  });

  it('should change type to icon', () => {
    const wrapper = shallow(<Button type='icon' dynamicIcon='Home' label='click' />).first().shallow().first().shallow();
    assert.strictEqual(wrapper.childAt(0).type(), SvgIcons['Home']);
  });

  it('should render a <MuiButton> element', () => {
    const wrapper = shallow(<Button label='click' />).first().shallow().first().shallow();
    assert.strictEqual(wrapper.type(), MuiButton);
  });

  it('should render a dynamicIcon', () => {
    const wrapper = shallow(<Button label='click' dynamicIcon='Home' />).first().shallow().first().shallow();
    assert.strictEqual(wrapper.childAt(0).type(), SvgIcons['Home']);
  });
});
