import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';

import { getTheme } from '../../src/base/b-theme';
import { BLabel } from '../../src/components/label/b-label';

var context = {};
context.theme = getTheme({ themeName: 'violet' });
context.localization = [];
context.localization.isRightToLeft = false;

const stories = storiesOf('Labels', module);

stories.addDecorator(withKnobs);
stories.add('BLabel', () =>
  <BLabel context={context}
    text={text('Text', 'Lorem ing elit. Donec malesuada, sem quis lacinia elementum, urna mi elementum metus')}>
  </BLabel>
);
stories.add('BLabelAdvanced', () =>
  <BLabel context={context}
    text={text('MoreText', 'Lorem ing elit. Donec malesuada, sem quis lacinia elementum, urna mi elementum metus')}>
  </BLabel>
);
