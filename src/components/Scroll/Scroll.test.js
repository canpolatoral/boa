import React from 'react';
import Scroll from './Scroll';
import { context, createMount } from '../../../test/utils';

describe('<Scroll />', () => {
  let mount;

  before(() => {
    mount = createMount();
  });

  after(() => {
    mount.cleanUp();
  });

  it('should mount', () => {
    mount((
      <Scroll
        context={context}
        option={{ suppressScrollX: true }}>
        <div key="parent">
          <div key="test">test</div>
          <div key="test2">test2</div>
        </div>
      </Scroll>
    ));
  });
});
