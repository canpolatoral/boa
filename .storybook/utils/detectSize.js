import { Sizes } from '@boa/base';

const deviceThresholds = {
  SMALL: 512,
  MEDIUM: 1024,
};

export default function detectSize() {
  let deviceSize;
  const width = window.innerWidth || document.body.clientWidth;
  if (deviceThresholds.SMALL && width <= deviceThresholds.SMALL) {
    deviceSize = Sizes.SMALL;
  } else if (deviceThresholds.MEDIUM && width <= deviceThresholds.MEDIUM) {
    deviceSize = Sizes.MEDIUM;
  } else {
    deviceSize = Sizes.LARGE;
  }
  return deviceSize;
}
