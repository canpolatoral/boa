
  /* eslint-disable max-len */
  import React from 'react';
  import { storiesOf } from '@storybook/react';
  import { IconButton } from '../../src/components/IconButton';
  import Header from '../base/header';
  import Props from '../base/props-table';
  import Preview from '../base/preview';
  import doc from './doc.json';

  const stories = storiesOf('IconButton', module);

  stories.add('IconButton', ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <Header {...props} component={IconButton} doc={doc} />
        <Preview {...props} component={IconButton} doc={doc} />
        <Props {...props} component={IconButton} doc={doc} />
      </div>);
  });
