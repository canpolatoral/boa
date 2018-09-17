
import { storiesOf } from '@storybook/react';

const stories = storiesOf('Treeview', module);
stories.add('BTreeView', require('./b-treeview').default);
stories.add('BTreeViewGrid', require('./b-treeview-grid').default);