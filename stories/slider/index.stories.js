
  import React from 'react';
  import { storiesOf } from '@storybook/react';

  import { BSlider } from '../../src/components/slider/b-slider';

  import PropsViewer from '../base/props-viewer';
  import Playground from '../base/playground';
  import ComponentInfo from '../base/info';

  const data = require('../../src/components/slider/b-slider/docs/content.json');
  const defaults = require('../../src/components/slider/b-slider/assets/data/defaults.json');

  const stories = storiesOf('Slider', module);

  stories.add('Slider', () => {
    return (
      <div style={{ padding: 20, background: 'white' }}>
        <ComponentInfo component={BSlider} content={data} defaults={defaults} />
        <Playground component={BSlider} content={data} defaults={defaults} />
        <PropsViewer component={BSlider} content={data} defaults={defaults} />
      </div>);
  });
  