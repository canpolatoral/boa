import React from 'react';
import { shallow, mount } from 'enzyme';
import { assert } from 'chai';
import IconMenu from './IconMenu';
import Context from '../../../test/utils/context';
import IconButton from '@material-ui/core/IconButton';
import { Popover } from '@boa/components/Popover';

describe('<IconMenu /> tests', () => {
  it('should render', () => {
    const items = [
      {
        text: 'test',
        value: 1,
      },
      {
        text: 'test2',
        value: 2,
      },
    ];
    const wrapper = shallow(<IconMenu context={Context} items={items} />).dive().shallow();
    assert.strictEqual(wrapper.childAt(0).type(), IconButton);
    assert.strictEqual(wrapper.childAt(1).type(), Popover);
  });

  it('should mount', () => {
    const items = [
      {
        text: 'test',
        value: 1,
      },
      {
        text: 'test2',
        value: 2,
      },
    ];
    mount(<IconMenu context={Context} items={items} />);
  });
});
