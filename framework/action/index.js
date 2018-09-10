import { store } from '../store';
import { getProxy } from 'b-proxy';
import { BFormManager } from 'b-form-manager';

export const UPDATE_DEVICE_SIZE = 'BFRAMEWORK_UPDATE_DEVICE_SIZE';
export const UPDATE_THEME = 'BFRAMEWORK_UPDATE_THEME';
export const UPDATE_PLATFORM = 'BFRAMEWORK_UPDATE_PLATFORM';
export const CHANGE_APPLICATION_CONTEXT = 'BFRAMEWORK_APPLICATON_CONTEXT';
export const CHANGE_LANGUAGE = 'BFRAMEWORK_CHANGE_LANGUAGE';
export const CHANGE_MESSAGING_CONTEXT = 'BFRAMEWORK_CHANGE_MESSAGING_CONTEXT';
export const SAVE_SNAPSHOT = 'BFRAMEWORK_SAVE_SNAPSHOT';
export const EXECUTE_BEGIN = 'BFRAMEWORK_EXECUTE_BEGIN';
export const EXECUTE_END = 'BFRAMEWORK_EXECUTE_END';
export const RESET_STORE = 'BFRAMEWORK_RESET_STORE';

export function updateDeviceSize(size) {
  if (store.getState().context.deviceSize != size) {
    store.dispatch({
      type: UPDATE_DEVICE_SIZE,
      payload: {
        deviceSize: size
      },
      rpath: 'context'
    });
  }
}

export function updateTheme(theme) {
  store.dispatch({
    type: UPDATE_THEME,
    payload: {
      theme: theme
    },
    rpath: 'context'
  });
}

export function changeLanguage(language) {
  // todo dil değiştirmede hata alınırsa ?
  getProxy().callManual({
    baseUrl: '/api/Authentication',
    servicePath: 'ChangeLanguage',
    method: 'POST',
    contentType: 'application/json',
    data: {
      LanguageId: language
    }
  });
  BFormManager.clearCachedResourceInfo(language);
  store.dispatch({
    type: CHANGE_LANGUAGE,
    payload: {
      language: language
    },
    rpath: 'context'
  });
}

export function changeMessagingContext(messagingContext) {
  store.dispatch({
    type: CHANGE_MESSAGING_CONTEXT,
    payload: {
      messagingContext: messagingContext
    },
    rpath: 'context'
  });
}

export function changeApplicationContext(applicationContext) {
  store.dispatch({
    type: CHANGE_APPLICATION_CONTEXT,
    payload: {
      applicationContext: applicationContext
    },
    rpath: 'context'
  });
}

export function updatePlatform(platform) {
  store.dispatch({
    type: UPDATE_PLATFORM,
    payload: {
      platform: platform
    },
    rpath: 'context'
  });
}

export function transferDataToAction(type, options = null, data = null) {
  store.dispatch({
    type: type,
    payload: { options: options, data: data }
  });
}

export function executeBegin(requestBag) {
  executeMain(requestBag);
}

export function executeReportBegin(requestBag) {
  executeMain(requestBag, true, false);
}

export function executeTransactionBegin(requestBag) {
  executeMain(requestBag, false, true);
}

function executeMain(requestBag, fromReport = false, fromTransactional = false) {
  let { requestList, requestClass, requestBody, proxyTimeout, key, pageId, path } = requestBag;
  // let { requestClass, requestBody, key, showProgress, pageId, snapKey } = requestBag;

  if (!path) {
    if (!requestList) {
      requestBody.fromReportExecute = !!fromReport;
      requestBody.fromTransactionalExecute = !!fromTransactional;
    }
  }

  let requestId = 0;
  if (store.getState().executerStore[pageId]) {
    store.getState().executerStore[pageId].requestCounter++;
    requestId = store.getState().executerStore[pageId].requestCounter;
  }
  let requestKey = 'Request_' + requestId;
  if (!requestList) {
    key = !key && requestBody && requestBody.methodName ? requestBody.methodName : key;
  }

  store.dispatch({
    type: EXECUTE_BEGIN,
    payload: {
      ...requestBag,
      key: key,
      requestKey: requestKey,
      isTransactional: !requestList ? requestBody.fromTransactionalExecute : false
    }
  });

  let promise;
  if (!requestList) {
    if (path) { /* serviceCallManual */
      var manualRequest =
        {
          servicePath: path, // 'values/Generic'
          data: requestBody,
          method: 'POST',
          timeout:proxyTimeout
        };
      promise = serviceCallManual(manualRequest);
    } else { /* serviceCall */
      promise = serviceCall(requestClass, requestBody, proxyTimeout);
    }
  }
  else {
    promise = serviceMultipleCall(requestList);
  }

  promise.done((response) => {
    store.dispatch({
      type: EXECUTE_END,
      payload: {
        ...requestBag,
        key: key,
        requestKey: requestKey,
        response: response
      }
    });
  }).fail((jqXhr, textStatus, errorThrown) => {
    store.dispatch({
      type: EXECUTE_END,
      payload: {
        ...requestBag,
        key: key,
        response: { success: false },
        requestKey: requestKey
      }
    });
  });
}

export function hasPendingRequest(pageId, isTransactional = false) {
  const { executerStore } = store.getState();
  if (executerStore && executerStore[pageId]) {
    const pageExecuterStore = executerStore[pageId];
    if (pageExecuterStore.executionPool) {
      for (let requestKey in pageExecuterStore.executionPool) {
        const request = pageExecuterStore.executionPool[requestKey];
        if (request.isPending && (!isTransactional || (isTransactional && request.isTransactional))) {
          return true;
        }
      }
    }
  }
  return false;
}

// Sayfalarda bu method kullanılmalıdır. Web Api'deki generic method'a yönlendirir.
export function serviceCall(requestClass, requestBody, proxyTimeout, transferActions = [], transferOptions = null) {
  return _serviceCallInternal(false, null, requestClass, requestBody, proxyTimeout, transferActions, transferOptions);
}
// Sayfalarda kullanılmaması gerekiyor. Exceptional durumlarda kullanılabilir. Kullanılmadan önce mimari ekibe bilgi verilmeli.
export function serviceCallManual(request, transferActions = [], transferOptions = null) {
  return _serviceCallInternal(true, request, null, null, null, transferActions, transferOptions);
}

function _serviceCallInternal(isManual, request, requestClass, requestBody, proxyTimeout, transferActions = [], transferOptions = null) {
  if (getProxy()) {
    var promise = isManual ? getProxy().callManual(request) : getProxy().call(requestClass, requestBody, proxyTimeout);
    promise.done(function (result) {
      if (transferActions && transferActions.length > 0) {
        transferActions.forEach(actionType => {
          store.dispatch(transferDataToAction(actionType, transferOptions, result));
        });
      }
    });
    return promise;
  } else {
    throw 'b-framework proxy instance not set';
  }
}

// Sayfalarda bu method kullanılmalıdır. Web Api'deki generic method'a yönlendirir.
export function serviceMultipleCall(requestList, transferActions = [], transferOptions = null) {
  return _serviceMultipleCallInternal(requestList, transferActions, transferOptions);
}

function _serviceMultipleCallInternal(requestList, transferActions = [], transferOptions = null) {
  if (getProxy()) {
    var promise = getProxy().callMultiple(requestList);
    promise.done(function (result) {
      if (transferActions && transferActions.length > 0) {
        transferActions.forEach(actionType => {
          store.dispatch(transferDataToAction(actionType, transferOptions, result));
        });
      }
    });
    return promise;
  }
  else {
    throw 'b-framework proxy instance not set';
  }
}

export function logoutProxy() {
  if (getProxy()) {
    getProxy().logout();
  }
  else {
    throw 'b-framework proxy instance not set';
  }
}
