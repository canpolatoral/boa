import React from 'react';
import { assert } from 'chai';
import MuiMenuList from '@material-ui/core/MenuList';
import Menu from './Menu';
import { context, createMount, createShallow } from '../../../test/utils';

describe('<Menu />', () => {
  // const items = [
  //   {
  //     text: 'test',
  //     value: 1,
  //     rightIcon: {
  //       dynamicIcon: 'Home',
  //     },
  //   },
  //   {
  //     text: 'test2',
  //     value: 2,
  //     items: [
  //       {
  //         text: 'test3',
  //         value: 3,
  //         leftIcon: {
  //           dynamicIcon: 'Home',
  //         },
  //       },
  //       {
  //         text: 'test4',
  //         value: 4,
  //       },
  //     ],
  //   },
  // ];

  let mount;
  let shallow;

  before(() => {
    mount = createMount();
    shallow = createShallow({ dive: true });
  });

  after(() => {
    mount.cleanUp();
  });

  it('should render MuiMenuList', () => {
    const wrapper = shallow(<Menu context={context} />);
    assert.strictEqual(wrapper.shallow().type(), MuiMenuList);
  });
});
