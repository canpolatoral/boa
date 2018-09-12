import { storiesOf } from '@storybook/react';

storiesOf('Button', module)
  .add('BButton', require('./b-button').default)
  .add('BActionButton', require('./b-action-button').default)
  .add('BIconButton', require('./b-icon-button').default);
