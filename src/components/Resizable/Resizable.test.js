import React from 'react';
import { mount } from 'enzyme';
import Resizable from './Resizable';
import context from '../../../test/utils/context';

describe('<Resizable /> tests', () => {
  it('should mount', () => {
    mount((
      <Resizable
        context={context}
        lockAspectRatio
        bounds="parent"
        minWidth={200}
        minHeight={100}
        default={{ x: 0, y: 0, width: '100%', height: '100%' }}>
        <div>test</div>
      </Resizable>
    ));
  });
});
