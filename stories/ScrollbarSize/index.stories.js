
  /* eslint-disable max-len */
  import React from 'react';
  import { storiesOf } from '@storybook/react';
  import { ScrollbarSize } from '../../src/components/ScrollbarSize';
  import Header from '../base/header';
  import Props from '../base/props-table';
  import Preview from '../base/preview';
  import doc from './doc.json';

  const stories = storiesOf('ScrollbarSize', module);

  stories.add('ScrollbarSize', ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <Header {...props} component={ScrollbarSize} doc={doc} />
        <Preview {...props} component={ScrollbarSize} doc={doc} />
        <Props {...props} component={ScrollbarSize} doc={doc} />
      </div>);
  });
