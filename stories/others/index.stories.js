
import { storiesOf } from '@storybook/react';

const stories = storiesOf('Others', module);
stories.add('BCaptcha', require('./b-captcha').default);
stories.add('BContentLoader', require('./b-content-loader').default);
stories.add('BDivider', require('./b-divider').default);
stories.add('BHtmlToReact', require('./b-html-to-react').default);
stories.add('BIcon', require('./b-icon').default);
stories.add('BImage', require('./b-image').default);
stories.add('BLoading', require('./b-loading').default);
stories.add('BPopover', require('./b-popover').default);
stories.add('BPromo', require('./b-promo').default);
stories.add('BSnackBar', require('./b-snackbar').default);