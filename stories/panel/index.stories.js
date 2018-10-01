
import { storiesOf } from '@storybook/react';

const stories = storiesOf('Panel', module);
stories.add('BCard', require('./b-card').default);
stories.add('BCardHeader', require('./b-card-header').default);
stories.add('BLinearPanel', require('./b-linear-panel').default);
