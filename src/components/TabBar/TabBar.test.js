// import React from 'react';
// import { assert } from 'chai';
// import { spy } from 'sinon';
// import { Resizable } from '@boa/components/Resizable';
// import TabBar from './TabBar';
// import { context, createMount, createShallow } from '../../../test/utils';

// describe('<TabBar /> tests', () => {
//   let mount;
//   let shallow;

//   before(() => {
//     mount = createMount();
//     shallow = createShallow({ dive: true });
//   });

//   it('should mount', () => {
//     const tabItems = [
//       {
//         text: 'Test',
//         value: 0,
//         content: <div>Tab Content 1</div>,
//       },
//       {
//         text: 'Test 2',
//         value: 1,
//         content: <div>Tab Content 2</div>,
//       },
//     ];

//     const wrapper = shallow((
//       <TabBar
//         context={context}
//         tabItems={tabItems}
//         rightIconButtonVisibility
//         value={0}
//       />
//     )).dive();
//   });
// });
