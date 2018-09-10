import React from 'react';
import { text } from '@storybook/addon-knobs';

import { getTheme } from '../../src/base/b-theme';
import { BLabel } from '../../src/components/label/b-label';

var context = {};
context.theme = getTheme({ themeName: 'violet' });
context.localization = [];
context.localization.isRightToLeft = false;

export default () =>
  <BLabel context={context}
    text={text('Text', 'Lorem ing elit. Donec malesuada, sem quis lacinia elementum, urna mi elementum metus')}>
  </BLabel>;
