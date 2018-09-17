
import { storiesOf } from '@storybook/react';

const stories = storiesOf('Switch', module);
stories.add('BCheckBox', require('./b-check-box').default);
stories.add('BCheckBoxGroup', require('./b-check-box-group').default);
stories.add('BRadioButton', require('./b-radio-button').default);
stories.add('BRadioButtonGroup', require('./b-radio-button-group').default);
stories.add('BToggle', require('./b-toggle').default);
stories.add('BToggleIcon', require('./b-toggle-icon').default);