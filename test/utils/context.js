import { getTheme, Sizes } from '@boa/base';

const context = {};
context.theme = getTheme({ themeName: 'kuveytturk' });
context.localization = [];
context.localization.isRightToLeft = false;
context.language = 1;
context.platform = '';
context.deviceSize = Sizes.MEDIUM;

export default context;
