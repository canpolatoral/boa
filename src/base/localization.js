import { Localization } from 'b-localization';
import { setMessagingOptions } from 'b-messaging';

export function setLocalization(options) {
  setMessagingOptions(options);
  Localization.staticConstructor(options.languageId);
}
