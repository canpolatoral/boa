import { configureStore, setStore } from './store';
import reducerRegistery from './reducer';
import { getMessageBase } from './utils/messaging';
import routeManager, { routeActions} from './router';

import {
  updateDeviceSize,
  updateTheme,
  updatePlatform,
  changeLanguage,
  transferDataToAction,
  serviceCall,
  serviceCallManual,
  serviceMultipleCall,
  changeApplicationContext,
  hasPendingRequest,
  logoutProxy
} from './action';
import { initResponsive, setDeviceThresholds, detectSize } from './connect';
import { Platforms, setFrameworkBaseMessage } from 'b-component';
import BasePage, { BasePageComposer }  from './base';
import BrowsePage, { BrowsePageComposer } from './browse-page';
import TransactionPage, { TransactionPageComposer } from './transaction-page';
import TransactionWizardPage, { TransactionWizardPageComposer } from './transaction-wizard-page';
import { setProxy, getProxy } from 'b-proxy';
import { BLocalization } from 'b-localization';
import {manageTokenCookies} from './utils/cookie';

export let store = null;
export let configure = function (options) {
  const defaultOptions =
    {
      applicationName: 'BOAOneOffice',
      platform: Platforms.DESKTOP,
      bufferlength: 20,
      language: 1,
      deviceThresholds: {
        SMALL: 512,
        MEDIUM: 1024
      }
    };
  options = Object.assign(defaultOptions, options);

  setProxy(options.proxy, options.environment);
  getProxy().callManual({
    baseUrl: '/api/Authentication',
    servicePath: 'ClearWebServerCache',
    method: 'POST',
    contentType: 'application/json',
    data: {}
  });

  setFrameworkBaseMessage(getMessage, getMessageCode);
  setDeviceThresholds(options.deviceThresholds);

  reducerRegistery.init(options.corereducers, options.bufferlength);

  var context = {
    applicationName: options.applicationName,
    deviceSize: detectSize(),
    platform: options.platform,
    theme: options.theme,
    language: options.language,
    messagingContext: null,
    localization: null,
    environment: options.environment
  };

  manageTokenCookies(context, routeManager);

  BLocalization.staticConstructor(options.language);
  context.localization = BLocalization.createLocalizationContext(options.language);

  var initialState = Object.assign({}, { context: context});
  if (options.externalStore) {
    store = setStore(options.externalStore);
  }
  else {
    store = configureStore(initialState, options.middlewares, options.devToolsComposition);
  }

  function getMessage(groupName, propertyName) {
    if (store && store.getState() && store.getState().context) {
      return getMessageBase(store.getState().context, groupName, propertyName).Description;
    }
    else {
      return groupName + '.' + propertyName;
    }
  }

  function getMessageCode(groupName, propertyName) {
    if (store && store.getState() && store.getState().context) {
      return getMessageBase(store.getState().context, groupName, propertyName).Code;
    }
    else {
      return groupName + '.' + propertyName;
    }
  }
};

export {
  routeManager,
  routeActions,
  initResponsive,
  BasePage,
  BasePageComposer,
  BrowsePage,
  BrowsePageComposer,
  TransactionPage,
  TransactionPageComposer,
  TransactionWizardPage,
  TransactionWizardPageComposer,
  updateDeviceSize,
  updateTheme,
  changeLanguage,
  updatePlatform,
  transferDataToAction,
  serviceCall,
  serviceCallManual,
  serviceMultipleCall,
  setProxy,
  getProxy,
  changeApplicationContext,
  hasPendingRequest,
  logoutProxy
};

export function resetStore() {
  reducerRegistery.resetStore();
}

export function getMessage(groupName, propertyName) {
  if (store && store.getState() && store.getState().context) {
    return getMessageBase(store.getState().context, groupName, propertyName).Description;
  }
  else {
    return groupName + '.' + propertyName;
  }
}

export function getMessageCode(groupName, propertyName) {
  if (store && store.getState() && store.getState().context) {
    return getMessageBase(store.getState().context, groupName, propertyName).Code;
  }
  else {
    return groupName + '.' + propertyName;
  }
}