import { getTheme } from '.';
import { assert } from 'chai';

describe('Themes', () => {
  it('should load theme', () => {
    const theme = getTheme({ themeName: 'summer' });
    assert.strictEqual(theme.typography.useNextVariants, true);
    assert.strictEqual(theme.themeName, 'summer');
  });

  it('should load default theme', () => {
    const theme = getTheme({ themeName: 'notfoundtheme' });
    assert.strictEqual(theme.typography.useNextVariants, true);
    assert.strictEqual(theme.themeName, 'winter');
  });
});
