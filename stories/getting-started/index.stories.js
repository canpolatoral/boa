import React from 'react';
import { storiesOf } from '@storybook/react';
import { DocViewer } from '@boa/components/DocViewer';
import Installation from './docs/install';
import Usage from './docs/usage';
import Architecture from './docs/architecture';

storiesOf('Getting Started', module)
  .add('Installation', () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <DocViewer content={Installation} editorType="github" />
      </div>
    );
  })
  .add('Usage', () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <DocViewer content={Usage} editorType="github" />
      </div>
    );
  })
  .add('Architecture', () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <DocViewer content={Architecture} />
      </div>
    );
  })
  .add('Platforms', () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <DocViewer content={'## No Content'} editorType="github" />
      </div>
    );
  })
  .add('Contribition', () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <DocViewer content={'## No Content'} editorType="github" />
      </div>
    );
  })
  .add('Testing', () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <DocViewer content={'## No Content'} editorType="github" />
      </div>
    );
  })
  .add('FAQ', () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <DocViewer content={'## No Content'} editorType="github" />
      </div>
    );
  });
