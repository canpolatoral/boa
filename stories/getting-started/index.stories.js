import React from 'react';
import { storiesOf } from '@storybook/react';

import { BDocViewer } from '../../src/components/documentation/b-doc-viewer';
import Installation from './docs/install';
import Usage from './docs/usage';
import Architecture from './docs/architecture';

storiesOf('Getting Started', module)
  .add('Installation', () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <BDocViewer content={Installation} editorType='atomOneLight' />
      </div>);
  })
  .add('Usage', () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <BDocViewer content={Usage} editorType='atomOneLight' />
      </div>);
  }).add('Architecture', () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <BDocViewer content={Architecture} />
      </div>);
  }).add('Platforms', () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <BDocViewer content={'## No Content'} editorType='atomOneLight' />
      </div>);
  }).add('Contribition', () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <BDocViewer content={'## No Content'} editorType='atomOneLight' />
      </div>);
  }).add('Testing', () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <BDocViewer content={'## No Content'} editorType='atomOneLight' />
      </div>);
  }).add('FAQ', () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <BDocViewer content={'## No Content'} editorType='atomOneLight' />
      </div>);
  });
