import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import ErrorBoundary from './ErrorBoundary';

describe('<ErrorBoundary /> tests', () => {
  it('should render child when no error', () => {
    const wrapper = mount((
      <ErrorBoundary>
        <div>
          ErrorBoundaryTest
        </div>
      </ErrorBoundary>
    ));
    expect(wrapper.text()).contains('ErrorBoundaryTest');
  });
});
