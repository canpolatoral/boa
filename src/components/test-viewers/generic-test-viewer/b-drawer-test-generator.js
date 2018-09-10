import React from 'react';
var BDrawer = require('b-drawer').BDrawer;

import { mailFolderListItems } from './mock/mock-drawer.js';

let drawerStyle = { top: 120, bottom: 0, height: null, overflow: null };

export class BDrawerTestGenerator {
  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
  }
  generate(context) {
    return [
      {
        'text': 'BDrawer',
        'component':
  <div>
    <BDrawer
              context={context}
              docked={true}
              width={270}
              containerStyle={drawerStyle}
              open={true}
              overlayStyle={{ backgroundColor: 'rgba(0,0,0,0)' }}>
      {mailFolderListItems}
    </BDrawer>
  </div>
      }

    ];
  }
}
export default BDrawerTestGenerator;
