
import { storiesOf } from '@storybook/react';

const stories = storiesOf('Toolbar', module);
stories.add('BPageHost', require('./b-page-host').default);
stories.add('BTabBar', require('./b-tab-bar').default);
stories.add('BUserProfile', require('./b-user-profile').default);