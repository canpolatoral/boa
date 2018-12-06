import React from 'react';
import { mount } from 'enzyme';
import Scroll from './Scroll';
import context from '../../../test/utils/context';

describe('<Scroll /> tests', () => {
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
