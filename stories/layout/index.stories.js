
import { storiesOf } from '@storybook/react';

const stories = storiesOf('Layout', module);
stories.add('BCardSection', require('./b-card-section').default);
stories.add('BExpander', require('./b-expander').default);
stories.add('BFlexPanel', require('./b-flex-panel').default);
stories.add('BFooter', require('./b-footer').default);
stories.add('BGridRow', require('./b-grid-row').default);
stories.add('BGridSection', require('./b-grid-section').default);
stories.add('BResizable', require('./b-resizable').default);
stories.add('BResizableBeta', require('./b-resizable-beta').default);
stories.add('undefined', require('./b-side-bar').default);
stories.add('BStepper', require('./b-stepper').default);