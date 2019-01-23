import { spy } from 'sinon';
import { assert, expect } from 'chai';
import moment from 'moment';
import numeral from 'numeral';
import { Localization } from '..';

const languages = [
  { id: 1, code: 'tr' },
  { id: 2, code: 'en' },
  { id: 3, code: 'de' },
  { id: 4, code: 'ru' },
  { id: 5, code: 'ar-ly', isRightToLeft: true },
  { id: 6, code: 'en' }, // for default values
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
    languages.forEach(language => {
      Localization.staticConstructor(language.id);
      assert.strictEqual(moment.locale(), language.code);
      assert.strictEqual(numeral.locale(), language.code);
    });
  });

  it('should static constructor set "ar" locales to numeral', () => {
    delete numeral.locales['ar-ly'];
    spy(numeral, 'register');
    Localization.staticConstructor(5);
    const args = numeral.register.args;
    numeral.register.restore();
    assert.strictEqual(args[0][2].delimiters.thousands, ',');
    assert.strictEqual(args[0][2].delimiters.decimal, '.');
    assert.strictEqual(args[0][2].ordinal(), ' ');
  });

  it('should create localization context set to RTL', () => {
    languages.forEach(language => {
      const localizationContext = Localization.createLocalizationContext(language.id);
      assert.strictEqual(localizationContext.isRightToLeft, !!language.isRightToLeft);
    });
  });

  it('should changeLocalizationLanguage set moment and numeral locales', () => {
    languages.forEach(language => {
      Localization.changeLocalizationLanguage(language.id);
      assert.strictEqual(moment.locale(), language.code);
      assert.strictEqual(numeral.locale(), language.code);
    });
  });

  it('should return localization language', () => {
    languages
      .filter(x => x.id !== 6)
      .forEach(language => {
        Localization.changeLocalizationLanguage(language.id);
        assert.strictEqual(Localization.getLocalizationLanguage().language, language.code);
        assert.strictEqual(Localization.getLocalizationLanguage().languageId, language.id);
      });
  });
});
