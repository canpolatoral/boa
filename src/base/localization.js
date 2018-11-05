import {
  Localization,
  setMessagingOptions,
} from '@boa/utils'; // eslint-disable-line import/no-unresolved

export default function setLocalization(options) {
  setMessagingOptions(options);
  Localization.staticConstructor(options.languageId);
}
