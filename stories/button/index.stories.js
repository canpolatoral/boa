
import { storiesOf } from '@storybook/react';

const stories = storiesOf('Button', module);
stories.add('BActionButton', require('./b-action-button').default);
stories.add('BButton', require('./b-button').default);
stories.add('BIconButton', require('./b-icon-button').default);