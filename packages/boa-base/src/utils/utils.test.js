import { assert } from 'chai';
import { stub } from 'sinon';
import { Utils, findIndex } from './utils';

describe('Utils', () => {
  describe('findIndex', () => {
    it('should return indexOf item from array', () => {
      const findIndexStub = stub(Array.prototype, 'findIndex').callsFake(findIndex);
      const indexOfOne = [1, 2, 3, 4, 5].findIndex(x => x === 1);
      const indexOfTwo = [1, 2, 3, 4, 5].findIndex(x => x === 2);
      findIndexStub.restore();
      assert.strictEqual(indexOfOne, 0);
      assert.strictEqual(indexOfTwo, 1);
    });

    it('should return -1 when item not exists', () => {
      const findIndexStub = stub(Array.prototype, 'findIndex').callsFake(findIndex);
      const indexOf = [1, 2, 3, 4, 5].findIndex(x => x === 0);
      findIndexStub.restore();
      assert.strictEqual(indexOf, -1);
    });
  });

  it('should generate valid UUID', () => {
    const uuid = Utils.generateUUID();
    const v4regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    const test = v4regex.test(uuid);
    assert.strictEqual(test, true);
  });

  describe('stringFormat', () => {
    it('should format string', () => {
      const format = '{0} {1}';
      const string = Utils.stringFormat(format, 'hello', 'world');
      assert.strictEqual(string, 'hello world');
    });

    it('should format string with array', () => {
      const format = '{0} {1}';
      const string = Utils.stringFormat(format, ['hello', 'world']);
      assert.strictEqual(string, 'hello world');
    });
  });

  describe('stringPadLeft', () => {
    it('should pad left', () => {
      const string = Utils.stringPadLeft('hello', 10);
      assert.strictEqual(string, '     hello');
    });

    it('should pad left with custom char', () => {
      const string = Utils.stringPadLeft('hello', 10, '*');
      assert.strictEqual(string, '*****hello');
    });
  });
});
