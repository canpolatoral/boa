
import { storiesOf } from '@storybook/react';

const stories = storiesOf('Progress', module);
stories.add('BIndicator', require('./b-indicator').default);
stories.add('BProgress', require('./b-progress').default);