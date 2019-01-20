import { Utils } from '@boa/base';

export function getTimeInfo(duration) {
  const minutes = Utils.stringPadLeft(parseInt(duration / 60, 10), 2, '0');
  const seconds = Utils.stringPadLeft(parseInt(duration % 60, 10), 2, '0');

  return `${minutes}:${seconds}`;
}

export function hasValue(value) {
  if (value === '' || value === undefined || value === null) {
    return false;
  }
  return true;
}
