import { Localization, setMessagingOptions } from '@boa/utils';

export function setLocalization(options) {
  setMessagingOptions(options);
  Localization.staticConstructor(options.languageId);
}
