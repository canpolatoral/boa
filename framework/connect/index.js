import { Sizes } from 'b-component';
import { updateDeviceSize, updateTheme, updatePlatform } from '../action';

var deviceThresholds = {
  SMALL: 512,
  MEDIUM: 1024
};
export var setDeviceThresholds = function(thresholds) {
  deviceThresholds = thresholds;
};

export var detectSize = function() {
  var deviceSize;
  var width = window.innerWidth || document.body.clientWidth;
  if (deviceThresholds.SMALL && width <= deviceThresholds.SMALL) {
    deviceSize = Sizes.SMALL; /* Telefon*/
  } else if (deviceThresholds.MEDIUM && width <= deviceThresholds.MEDIUM) {
    deviceSize = Sizes.MEDIUM; /* Tablet*/
  } else {
    deviceSize = Sizes.LARGE; /* Desktop*/
  }
  return deviceSize;
};

export var initResponsive = function (target) {
  target.updateDeviceSize = updateDeviceSize;
  target.updateTheme = updateTheme;
  target.updatePlatform = updatePlatform;
  // const detect = detectSize();

  function callback() {
    const deviceSize = detectSize();
    target.updateDeviceSize(deviceSize);
  }

  function themeCallback(e) {
    target.updateTheme(e.theme);
  }

  function platformCallback(e) {
    target.updatePlatform(e.platform);
  }

  if (window.addEventListener) {
    window.addEventListener('resize', callback);
    window.addEventListener('changetheme', themeCallback);
    window.addEventListener('changeplatform', platformCallback);
  }
  else {
    window.attachEvent('on' + 'resize', () => {
      callback.call(window);
    });
    window.attachEvent('on' + 'changetheme', () => {
      themeCallback.call(window);
    });
    window.attachEvent('on' + 'changeplatform', () => {
      platformCallback.call(window);
    });
  }
};
