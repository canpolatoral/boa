export default function loadTheme(colors) {
  return {
    typography: {
      fontFamily: 'Roboto, sans-serif',
      fontSize: 14,
      htmlFontSize: 16
    },
    palette: {
      primary: {
        light: colors.pri300,
        main: colors.pri500,
        dark: colors.pri500, // todo dark pri700

        300: colors.pri500 // dx-react-grid-material-ui

      },
      secondary: {
        light: colors.sec300,
        main: colors.sec500,
        dark: colors.sec500 // todo dark pri700
      },
      error: {
        light: colors.error500,
        main: colors.error500,
        dark: colors.error500 // todo dark pri700
      },
      // Used by `getContrastText()` to maximize the contrast between the background and
      // the text.
      contrastThreshold: 3,
      // Used to shift a color's luminance by approximately
      // two indexes within its tonal palette.
      // E.g., shift from Red 500 to Red 300 or Red 700.
      tonalOffset: 0.2,
      type: 'light'
    },
    boaPalette: colors
  };
}
