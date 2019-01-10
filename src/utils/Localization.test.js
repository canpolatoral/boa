import { assert, expect } from 'chai';
import { Localization } from './Localization';
import moment from 'moment';
import numeral from 'numeral';

const languages = [
  { id: 1, code: 'tr' },
  { id: 2, code: 'en' },
  { id: 3, code: 'de' },
  { id: 4, code: 'ru' },
  { id: 5, code: 'ar-ly', isRightToLeft: true },
];

describe('Localization', () => {
  it('should default values set to english ', () => {
    assert.strictEqual(Localization.language, 'en');
    assert.strictEqual(Localization.languageId, 2);
  });

  it('should have curreny formats ', () => {
    expect(Localization.currencyFormats).to.be.have.property('D');
    expect(Localization.currencyFormats).to.be.have.property('F');
    expect(Localization.currencyFormats).to.be.have.property('M');
    expect(Localization.currencyFormats).to.be.have.property('FX');
  });

  it('should have number formats ', () => {
    expect(Localization.currencyFormats).to.be.have.property('D');
    expect(Localization.currencyFormats).to.be.have.property('F');
  });

  it('should static constructor set moment and numeral locales', () => {
    languages.forEach((language) => {
      Localization.staticConstructor(language.id);
      assert.strictEqual(moment.locale(), language.code);
      assert.strictEqual(numeral.locale(), language.code);
    });
  });

  it('should create localization context set to RTL', () => {
    languages.forEach((language) => {
      const localizationContext = Localization.createLocalizationContext(language.id);
      assert.strictEqual(localizationContext.isRightToLeft, !!language.isRightToLeft);
    });
  });

  it('should changeLocalizationLanguage set moment and numeral locales', () => {
    languages.forEach((language) => {
      Localization.changeLocalizationLanguage(language.id);
      assert.strictEqual(moment.locale(), language.code);
      assert.strictEqual(numeral.locale(), language.code);
    });
  });
});
