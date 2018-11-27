import { assert } from 'chai';
import sinon from 'sinon';
import setLocalization from './localization';
import { Localization } from '@boa/utils';

describe('setLocalization tests', () => {
  it('should call right functions', () => {
    const staticConstructor = sinon.stub(Localization, 'staticConstructor');
    setLocalization({ languageId: 2 });
    staticConstructor.restore();
    assert.strictEqual(staticConstructor.callCount, 1, 'should have called the staticConstructor');
  });
});
