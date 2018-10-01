
import { storiesOf } from '@storybook/react';

const stories = storiesOf('Documentation', module);
stories.add('BDocCode', require('./b-doc-code').default);
stories.add('BDocNotice', require('./b-doc-notice').default);
stories.add('BDocToc', require('./b-doc-toc').default);
stories.add('BDocViewer', require('./b-doc-viewer').default);
