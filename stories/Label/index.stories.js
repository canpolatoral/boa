
  /* eslint-disable max-len */
  import React from 'react';
  import { storiesOf } from '@storybook/react';
  import { Label } from '../../src/components/Label';
  import Header from '../base/header';
  import Props from '../base/props-table';
  import Preview from '../base/preview';
  import doc from './doc.json';

  const stories = storiesOf('Label', module);

  stories.add('Label', ({ props }) => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <Header {...props} component={Label} doc={doc} />
        <Preview {...props} component={Label} doc={doc} />
        <Props {...props} component={Label} doc={doc} />
      </div>);
  });
