import { getTheme } from '@boa/base';

const context = {};
context.theme = getTheme({ themeName: 'violet' });
context.localization = [];
context.localization.isRightToLeft = false;
context.language = 1;

export default function getContext() {
  return context;
}
