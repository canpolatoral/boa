import {
  Localization,
  setMessagingOptions,
} from '@boa/utils';

export default function setLocalization(options) {
  setMessagingOptions(options);
  Localization.staticConstructor(options.languageId);
}
