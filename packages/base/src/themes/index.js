import merge from 'lodash/merge';
import { createMuiTheme } from '@material-ui/core/styles';
import loadTheme from '../utils/theme';

export function getThemeList() {
  return [
    { name: 'winter', id: 0 },
    { name: 'summer', id: 1 },
    { name: 'fall', id: 2 },
    { name: 'spring', id: 3 },
    { name: 'night', id: 4 },
    { name: 'violet', id: 5 },
    { name: 'rose', id: 6 },
    { name: 'sea', id: 7 },
    { name: 'dark', id: 8 },
    { name: 'kuveytturk', id: 9 },
    { name: 'ash', id: 10 },
    { name: 'orange', id: 11 },
    { name: 'magenta', id: 12 },
  ];
}

export function getTheme(opt) {
  const options = merge({
    themeName: 'winter',
    kendoThemePath: 'assets/themes',
    externalTheme: {},
  }, opt);

  const themeId = getThemeList().findIndex((t) => {
    return t.name === (options.themeName).toLowerCase().replace(' ', '');
  });

  if (themeId === -1) {
    options.themeName = 'winter';
  }

  // eslint-disable-next-line
  const theme = loadTheme(require(`./${options.themeName}/colors`));

  const targetTheme = merge(
    {
      centeredLayout: false,
      themeName: options.themeName,
      kendoThemePath: options.kendoThemePath,
    },
    theme,
    options.externalTheme,
    {
      typography: {
        useNextVariants: true,
      },
    });

  const targetMuiTheme = createMuiTheme(targetTheme);
  return targetMuiTheme;
}
