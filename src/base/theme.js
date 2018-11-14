/* eslint-disable global-require */
import merge from 'lodash/merge';
import { createMuiTheme } from '@material-ui/core/styles';

function loadTheme(colors) {
  return {
    typography: {
      fontFamily: 'Roboto, sans-serif',
      fontSize: 14,
      htmlFontSize: 16,
    },
    palette: {
      primary: {
        light: colors.pri300,
        main: colors.pri500,
        dark: colors.pri500, // todo dark pri700

        300: colors.pri500, // dx-react-grid-material-ui
      },
      secondary: {
        light: colors.sec300,
        main: colors.sec500,
        dark: colors.sec500, // todo dark pri700
      },
      error: {
        light: colors.error500,
        main: colors.error500,
        dark: colors.error500, // todo dark pri700
      },
      // Used by `getContrastText()` to maximize the contrast between the background and
      // the text.
      contrastThreshold: 3,
      // Used to shift a color's luminance by approximately
      // two indexes within its tonal palette.
      // E.g., shift from Red 500 to Red 300 or Red 700.
      tonalOffset: 0.2,
      type: 'light',
    },
    boaPalette: colors,
  };
}

export default function getTheme(opt) {
  const options = merge(
    {
      themeName: 'winter',
      kendoThemePath: 'assets/themes',
      externalTheme: {},
    },
    opt,
  );

  let theme = {};
  switch (options.themeName) {
    case 'summer':
      theme = loadTheme(require('./themes/summer/colors'));
      break;
    case 'violet':
      theme = loadTheme(require('./themes/violet/colors'));
      break;
    case 'night':
      theme = loadTheme(require('./themes/night/colors'));
      break;
    case 'kt-green':
      theme = loadTheme(require('./themes/kt-green/colors'));
      break;
    case 'spring':
    default:
      theme = loadTheme(require('./themes/winter/colors'));
      break;
  }

  const targetTheme = merge(
    {
      centeredLayout: false,
      themeName: options.themeName,
      kendoThemePath: options.kendoThemePath,
      typography: {
        useNextVariants: true,
      },
    },
    theme,
    options.externalTheme,
  );

  return createMuiTheme(targetTheme);
}
