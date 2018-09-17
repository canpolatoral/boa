
import { storiesOf } from '@storybook/react';

const stories = storiesOf('Panel', module);
stories.add('BAppCard', require('./b-app-card').default);
stories.add('BCard', require('./b-card').default);
stories.add('BCardHeader', require('./b-card-header').default);
stories.add('BCriteriaPanel', require('./b-criteria-panel').default);
stories.add('BLinearPanel', require('./b-linear-panel').default);
stories.add('BShowHidePanel', require('./b-show-hide-panel').default);