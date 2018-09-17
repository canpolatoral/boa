
import { storiesOf } from '@storybook/react';

const stories = storiesOf('Input', module);
stories.add('BAutoComplete', require('./b-auto-complete').default);
stories.add('BInput', require('./b-input').default);
stories.add('BInputAction', require('./b-input-action').default);
stories.add('BInputMask', require('./b-input-mask').default);
stories.add('BInputNumeric', require('./b-input-numeric').default);
stories.add('BInputSearch', require('./b-input-search').default);