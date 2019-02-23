import { getTheme, Sizes } from '@kuveytturk/boa-base';

const context = {};
context.theme = getTheme({ themeName: 'kuveytturk' });
context.localization = [];
context.localization.isRightToLeft = false;
context.language = 2;
context.platform = '';
context.deviceSize = Sizes.MEDIUM;

export default context;
