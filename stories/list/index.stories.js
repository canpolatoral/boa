
import { storiesOf } from '@storybook/react';

const stories = storiesOf('List', module);
stories.add('BGridList', require('./b-grid-list').default);
stories.add('BList', require('./b-list').default);
stories.add('BListItem', require('./b-list-item').default);
stories.add('BVirtualizedList', require('./b-virtualized-list').default);