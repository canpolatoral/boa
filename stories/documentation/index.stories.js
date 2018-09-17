
import { storiesOf } from '@storybook/react';

const stories = storiesOf('Documentation', module);
stories.add('BDocCode', require('./b-doc-code').default);
stories.add('BDocMenu', require('./b-doc-menu').default);
stories.add('BDocNotice', require('./b-doc-notice').default);
stories.add('BDocPost', require('./b-doc-post').default);
stories.add('BDocToc', require('./b-doc-toc').default);
stories.add('BDocViewer', require('./b-doc-viewer').default);
stories.add('BFlowDoc', require('./b-flow-doc').default);