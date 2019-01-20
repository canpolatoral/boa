import Themes from '.';
import { assert } from 'chai';

describe('Themes', () => {
  it('should be same keys', () => {
    let prev;
    Object.keys(Themes).forEach((key) => {
      if (prev) {
        const prevKeys = Object.keys(prev).sort();
        const keys = Object.keys(Themes[key]).sort();
        assert.strictEqual(JSON.stringify(prevKeys), JSON.stringify(keys));
      }
      prev = Themes[key];
    });
  });
});
