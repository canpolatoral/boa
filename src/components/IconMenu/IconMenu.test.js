import React from 'react';
import { assert } from 'chai';
import IconButton from '@material-ui/core/IconButton';
import { Popover } from '@boa/components/Popover';
import { Icon } from '@boa/components/Icon';
import MenuList from '@material-ui/core/MenuList';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import * as SvgIcons from '@material-ui/icons';
import IconMenu from './IconMenu';
import Context from '../../../test/utils/context';
import { createShallow, createMount } from '../../../test/utils/index';

describe('<IconMenu /> tests', () => {
  const items = [
    {
      text: 'test',
      value: 1,
      rightIcon: {
        dynamicIcon: 'Home',
      },
    },
    {
      text: 'test2',
      value: 2,
      items: [
        {
          text: 'test3',
          value: 3,
          leftIcon: {
            dynamicIcon: 'Home',
          },
        },
        {
          text: 'test4',
          value: 4,
        },
      ],
    },
  ];
  let shallow;
  let mount;

  before(() => {
    shallow = createShallow({ dive: true });
    mount = createMount();
  });

  it('should render', () => {
    const wrapper = shallow(<IconMenu context={Context} items={items} />);
    const menuList = wrapper.shallow().childAt(1).childAt(0);

    assert.strictEqual(wrapper.shallow().childAt(0).type(), IconButton);
    assert.strictEqual(wrapper.shallow().childAt(1).type(), Popover);
    assert.strictEqual(menuList.type(), MenuList);

    menuList.children().forEach((child, index) => {
      const item = items[index];
      assert.strictEqual(item.value, child.props().value);
      if (item.items) {
        child.children().forEach((subChild, subIndex) => {
          const subItem = item.items[subIndex].value;
          assert.strictEqual(subItem.value, subChild.props().value);
          if (subItem.rightIcon) {
            assert.strictEqual(subChild.props().rightIcon, Icon.getIcon(subItem.rightIcon));
          }
          if (subItem.leftIcon) {
            assert.strictEqual(subChild.props().leftIcon, Icon.getIcon(subItem.leftIcon));
          }
        });
      }
      // if (item.rightIcon) {
      //   assert.strictEqual(child.props().rightIcon, Icon.getIcon(item.rightIcon));
      // }
      if (item.leftIcon) {
        assert.strictEqual(child.props().leftIcon, Icon.getIcon(item.leftIcon));
      }
    });
  });

  it('should mount', () => {
    mount(<IconMenu context={Context} />);
  });

  describe('prop: iconType', () => {
    it('should render MoreVertIcon default', () => {
      const wrapper = shallow(<IconMenu context={Context} items={items} />);
      const iconButton = wrapper.shallow().childAt(0);
      assert.strictEqual(iconButton.childAt(0).type(), MoreVertIcon);
    });

    it('should render MoreHorizIcon', () => {
      const wrapper = shallow(<IconMenu context={Context} items={items} iconType="horizontal" />);
      const iconButton = wrapper.shallow().childAt(0);
      assert.strictEqual(iconButton.childAt(0).type(), MoreHorizIcon);
    });

    it('should render custom ', () => {
      const Home = Icon.getIcon({ dynamicIcon: 'Home' });
      const wrapper = shallow((
        <IconMenu
          context={Context}
          items={items}
          iconType="custom"
          customIcon={Home} />
      ));
      const iconButton = wrapper.shallow().childAt(0);
      assert.strictEqual(iconButton.childAt(0).type(), SvgIcons.Home);
    });
  });
});
