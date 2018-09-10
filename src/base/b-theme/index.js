import merge from 'lodash/merge';
import { createMuiTheme } from '@material-ui/core/styles';
import loadTheme from './theme';

export function getTheme(opt) {

  var options = merge({ themeName: 'winter', kendoThemePath: 'assets/themes', externalTheme: {} }, opt);

  let theme = {};
  switch (options.themeName) {
    case 'summer':
      theme = loadTheme(require('./summer/colors')); break;
    case 'violet':
      theme = loadTheme(require('./violet/colors')); break;
    case 'night':
      theme = loadTheme(require('./night/colors')); break;
    case 'kt-green':
      theme = loadTheme(require('./kt-green/colors')); break;
    case 'spring':
    default:
      theme = loadTheme(require('./winter/colors')); break;
  }

  var targetTheme = merge({
    centeredLayout: false,
    themeName: options.themeName,
    kendoThemePath: options.kendoThemePath,
  }, theme, options.externalTheme);

  let targetMuiTheme = createMuiTheme(targetTheme);
  return targetMuiTheme;
}
