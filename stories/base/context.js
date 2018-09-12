
import { getTheme } from '../../src/base/b-theme';

var context = {};
context.theme = getTheme({ themeName: 'violet' });
context.localization = [];
context.localization.isRightToLeft = false;

export default context;
