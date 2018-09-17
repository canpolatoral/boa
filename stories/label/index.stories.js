
import { storiesOf } from '@storybook/react';

const stories = storiesOf('Label', module);
stories.add('BInformationText', require('./b-information-text').default);
stories.add('BLabel', require('./b-label').default);
stories.add('BMoreText', require('./b-more-text').default);
stories.add('BSpan', require('./b-span').default);