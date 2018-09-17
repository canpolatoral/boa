
import { storiesOf } from '@storybook/react';

const stories = storiesOf('Form', module);
stories.add('BActionManager', require('./b-action-manager').default);
stories.add('BActionManagerInfo', require('./b-action-manager-info').default);
stories.add('BBaseForm', require('./b-base-form').default);