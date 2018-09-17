
import { storiesOf } from '@storybook/react';

const stories = storiesOf('Grid', module);
stories.add('BCustomDataGrid', require('./b-custom-data-grid').default);
stories.add('BDataGrid', require('./b-data-grid-dx').default);
stories.add('BGridActionPanel', require('./b-grid-action-panel').default);