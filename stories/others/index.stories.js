
import { storiesOf } from '@storybook/react';

const stories = storiesOf('Others', module);
stories.add('BDivider', require('./b-divider').default);
stories.add('BIcon', require('./b-icon').default);
stories.add('BImage', require('./b-image').default);
stories.add('BPopover', require('./b-popover').default);
