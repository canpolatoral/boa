import Cookies from 'universal-cookie';

export class IProxy {
  constructor() {
  }

  getServicePath(path) {
    return process.env.NODE_ENV != 'production' ? `development/${path}` : `values/${path}`;
  }

  call(requestClass, requestBody, proxyTimeout) {
    let servicePath = this.getServicePath('Generic');

    return this.callManual({
      servicePath: servicePath,
      timeout: proxyTimeout,
      data: {
        type: requestClass,
        body: requestBody
      },
      method: 'POST'
    });
  }

  callMultiple(requestList) {
    let servicePath = this.getServicePath('GenericMultiple');

    return this.callManual({
      servicePath: servicePath,
      data: {
        requestList: requestList
      },
      method: 'POST'
    });
  }

  callManual(request) {
    if ((typeof request) === 'string') {
      request = { servicePath: request };
    }

    let result = this._serviceCall ? this._serviceCall(request) : Promise.reject('proxy class _serviceCall method not found');
    return result;
  }

  callManualSync(request) {
    if ((typeof request) === 'string') {
      request = { servicePath: request };
    }

    let result = this._serviceCallSync ? this._serviceCallSync(request) : Promise.reject('proxy class _serviceCallSync method not found');
    return result;
  }

  logout() {
    this.authenticationContext = null;
  }
}

export class ServiceProxy extends IProxy {
  constructor(baseUrl, logoutDelegate) {
    super();
    this.baseUrl = baseUrl;
    this.logoutDelegate = logoutDelegate;  // logout olduğunda çapırılacak method.
    this.defaultTimeout = 300000;
  }

  setLogoutDelegate(logoutDelegate) {
    this.logoutDelegate = logoutDelegate;  // logout olduğunda çapırılacak method.
  }

  getBaseUrl(request) {
    let baseUrl = request.baseUrl || this.baseUrl;
    if (baseUrl) {
      baseUrl = window.location.pathname + baseUrl;
      baseUrl = baseUrl.replace(/[\/\s]+/, '') + '/';
      baseUrl = baseUrl.replace(/[\/\s]+$/, '') + '/';
    }
    return baseUrl ? baseUrl : '';
  }

  _serviceCall(request) {
    var deferred = jQuery.Deferred();

    if ((typeof request) !== 'string') {
      const cookies = new Cookies();
      let containerToken = cookies.get('containerToken');
      if (containerToken && (request.servicePath.startsWith('values/'))) {
        request.servicePath = request.servicePath.replace('values/', 'container/');
        request.baseUrl = null;
        if (request.data) {
          request.data.containerToken = containerToken;
          request.data.containerUser = cookies.get('containerUser').UserName;
        }
      }
    }

    let baseUrl = this.getBaseUrl(request);
    let url = baseUrl + request.servicePath;
    let requestString = '';
    if (request.contentType == 'application/x-www-form-urlencoded; charset=UTF-8') {
      requestString = this.encodeObjectToParams(request.data);
    } else {
      requestString = JSON.stringify(request.data);
    }
    var hashInBase64 = {};
    if (this.authenticationContext && this.authenticationContext.refresh_token && window.CryptoJS) {
      var hash = window.CryptoJS.HmacSHA256(requestString, this.authenticationContext.refresh_token);
      hashInBase64 = window.CryptoJS.enc.Base64.stringify(hash);
    }
    let requestObj = {
      url: url,
      data: requestString,
      type: request.method || 'GET',
      timeout: request.timeout || this.defaultTimeout,
      async: request.async || true,
      crossDomain: true,
      cache: request.cache || false,
      processData: false,
      dataType: request.dataType || 'json',
      contentType: request.contentType || 'application/json; charset=utf-8',
      headers: Object.assign({ hmac: hashInBase64 }, request.headers, this.generateOAuthHeader())
    };

    let promise = $.ajax(requestObj);
    promise.done((response) => {
      if (bEnvironment == 'production') {
        response = this.editErrorMessages(response);
      }
      if (request.isAuthentication) {
        this.authenticationContext = {
          access_token: response.access_token,
          refresh_token: response.refresh_token,
          expires_in: response.expires_in
        };
        deferred.resolve(response.value);
      } else {
        response = this.resolveReferences(response);
        if (response.success == false
          && response.results
          && response.results[0].errorCode == '70369#SessionExpired'
          && (window).isBOALogin == true) {
          // BDevice.transferToBOAContainer('SessionTimeOutCheck');
          // bdevice proxyi referans veriyor, session kontolü için tekrar proxy e gelmesi gerekiyor, hata alıyor.Bu yüzden bu kontrol manuel yapıldı.
          this.sessionTimeOutCheck();
        }
        deferred.resolve(response);
      }
    });
    promise.fail((jqXhr, textStatus, errorThrown) => {
      if ((jqXhr.status == 400 || jqXhr.status == 401)
        && jqXhr.getAllResponseHeaders().indexOf('token is expired') > 0
        && this.authenticationContext) {
        var refreshPromise = this.refreshRequest();
        refreshPromise.done(() => {
          requestObj.headers = Object.assign(requestObj.headers, this.generateOAuthHeader());
          var retryPromise = $.ajax(requestObj);
          retryPromise.done((response) => {
            response = this.resolveReferences(response);
            deferred.resolve(response);
          });
          retryPromise.fail((jqXhrRetry, textStatusRetry, errorThrownRetry) => {
            this.rejectPromiseWithLogout(deferred, jqXhrRetry, textStatusRetry, errorThrownRetry);
          });
        });
        refreshPromise.fail((jqXhrRefresh, textStatusRefresh, errorThrownRefresh) => {
          this.rejectPromiseWithLogout(deferred, jqXhrRefresh, textStatusRefresh, errorThrownRefresh);
        });
      }
      else if ((jqXhr.status == 400 || jqXhr.status == 401)
        && jqXhr.getAllResponseHeaders().indexOf('invalid_token') > 0) {
        this.rejectPromiseWithLogout(deferred, jqXhr, textStatus, errorThrown);
      } else if ((jqXhr.status == 400 || jqXhr.status == 401)
        && jqXhr.responseJSON && jqXhr.responseJSON.value
        && jqXhr.responseJSON.value.results
        && jqXhr.responseJSON.value.results[0].errorCode == '70369#SessionExpired'
        && (window).isBOALogin == true
      ) {
        // BDevice.transferToBOAContainer('SessionTimeOutCheck');
        // bdevice proxyi referans veriyor, session kontolü için tekrar proxy e gelmesi gerekiyor, hata alıyor.Bu yüzden bu kontrol manuel yapıldı.
        this.sessionTimeOutCheck();
      }
      else {
        deferred.reject(jqXhr, textStatus, errorThrown);
      }
    });
    return deferred.promise();
  }

  sessionTimeOutCheck() {
    var deferred = jQuery.Deferred();
    const boaServiceURL = 'https://' + machineName + ':' + window.BOA_SETTINGS.DEVICE_PARAMETERS.CONTAINER_PORT + '/';
    var request =
      {
        baseUrl: boaServiceURL + 'Container',
        servicePath: 'SessionTimeOutCheck',
        method: 'POST'
      };
    this.callManualSync(request);
    return deferred.promise();
  }

  editErrorMessages(response) {
    if (response && response.results && response.results.length > 0) {
      for (let i = 0; i < response.results.length; i++) {
        if (!response.results[i].isFriendly) {
          response.results[i].errorMessage = 'İşleminiz gerçekleştirilirken hiç beklenmedik bir hata oluştu.\nLütfen daha sonra tekrar deneyiniz.';
        }
      }
    }
    return response;
  }

  rejectPromiseWithLogout(deferredPromise, jqXhrRetry, textStatusRetry, errorThrownRetry) {
    if (this.logoutDelegate) {
      this.authenticationContext = null;
      this.logoutDelegate();
    }
    else {
      deferredPromise.reject(jqXhrRetry, textStatusRetry, errorThrownRetry);
    }
  }

  generateOAuthHeader() {
    var oAuthHeader = {};
    if (this.authenticationContext) {
      oAuthHeader = {
        'Authorization': 'Bearer ' + this.authenticationContext.access_token
      };
    }
    return oAuthHeader;
  }

  generateRefreshHeader() {
    var refreshHeader = {};
    if (this.authenticationContext) {
      refreshHeader = {
        'Authorization': 'Bearer ' + this.authenticationContext.refresh_token
      };
    }
    return refreshHeader;
  }

  encodeObjectToParams(obj) {
    var formData = '';
    for (var key in obj) {
      formData = formData + key + '=' + encodeURIComponent(obj[key]) + '&';
    }
    formData = formData.slice(0, -1);
    return formData;
    // return Object.keys(obj).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
  }

  _serviceCallSync(request) {
    let result = { data: null, isSuccess: false, error: null };
    let baseUrl = this.getBaseUrl(request);
    let url = baseUrl + request.servicePath;
    let requestString = JSON.stringify(request.data);
    let requestObj = {
      url: url,
      data: requestString,
      type: request.method || 'GET',
      timeout: request.timeout || this.defaultTimeout,
      async: false,
      crossDomain: true,
      cache: request.cache || false,
      processData: false,
      dataType: request.dataType || 'json',
      contentType: 'application/json; charset=utf-8',
      headers: request.headers,
      success: function (response) {
        result.isSuccess = true;
        result.data = response;
      },
      error: function (jqXhr, textStatus, errorThrown) {
        result.isSuccess = false;
        result.error = errorThrown;
      }
    };

    $.ajax(requestObj);
    return result;
  }

  resolveReferences(json) {
    if (typeof json === 'string') {
      try {
        json = JSON.parse(json);
      }
      catch (err) {
        // for base64string, it have to be return as it is, it is already json :)
      }
    }

    var byid = {}, // all objects by id
      refs = []; // references to objects that could not be resolved
    json = (function recurse(obj, prop, parent) {
      if (typeof obj !== 'object' || !obj) // a primitive value
        return obj;
      if (Object.prototype.toString.call(obj) === '[object Array]') {
        for (var i = 0; i < obj.length; i++)
          // check also if the array element is not a primitive value
          if (typeof obj[i] !== 'object' || !obj[i]) // a primitive value
            continue;
          else if ('$ref' in obj[i])
            obj[i] = recurse(obj[i], i, obj);
          else
            obj[i] = recurse(obj[i], prop, obj);
        return obj;
      }
      if ('$ref' in obj) { // a reference
        var ref = obj.$ref;
        if (ref in byid)
          return byid[ref];
        // else we have to make it lazy:
        refs.push([parent, prop, ref]);
        return;
      } else if ('$id' in obj) {
        var id = obj.$id;
        delete obj.$id;
        if ('$values' in obj) // an array
          obj = obj.$values.map(recurse);
        else // a plain object
          for (var property in obj)
            obj[property] = recurse(obj[property], property, obj);
        byid[id] = obj;
      } else {
        for (var property2 in obj)
          obj[property2] = recurse(obj[property2], property2, obj);
      }
      return obj;
    })(json); // run it!

    for (var i = 0; i < refs.length; i++) { // resolve previously unknown references
      var ref = refs[i];
      ref[0][ref[1]] = byid[ref[2]];
      // Notice that this throws if you put in a reference at top-level
    }
    return json;
  }

  refreshRequest() {
    var deferred = jQuery.Deferred();
    let baseUrl = this.getBaseUrl({});
    let url = baseUrl + 'connect/refresh';
    let data = {
      grant_type: 'refresh_token',
      scope: ['openid offline_access'],
      refreshToken: this.authenticationContext.refresh_token
    };
    let requestString = this.encodeObjectToParams(data);
    var promise = $.ajax({
      url: url,
      type: 'POST',
      crossDomain: true,
      cache: false,
      data: requestString,
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      headers: this.generateRefreshHeader()
    });
    promise.done((response) => {
      if (this.authenticationContext) {
        this.authenticationContext.access_token = response.access_token;
      }
      deferred.resolve(response);
    });
    promise.fail((jqXhrRefresh, textStatusRefresh, errorThrownRefresh) => {
      deferred.reject(jqXhrRefresh, 'ReLoginRequired', errorThrownRefresh);
    });
    return deferred.promise();
  }
}

export default ServiceProxy;

export class MockProxy extends IProxy {
  constructor(mockDataDictionary) {
    super();
    this.mockDataDictionary = mockDataDictionary;
  }

  _serviceCall(request) {
    let methodName = request.servicePath;
    let dictionary = this.mockDataDictionary;
    return $.Deferred((deferred) => {
      try {
        let obj = null;
        for (let index in dictionary) {
          let item = dictionary[index];
          if (item && item.name === methodName) {
            obj = item.value(request.data);
            break;
          }
        }
        if (obj) {
          deferred.resolve(obj);
        }
        else {
          deferred.reject('method not found');
        }
      }
      catch (e) {
        deferred.reject(e);
      }
    });
  }
}

let bProxyInstance;
let bEnvironment;
let machineName = '';
export function getProxy() {
  return bProxyInstance;
}

export function setProxy(proxy, environment = null) {
  bProxyInstance = proxy;
  bEnvironment = environment;
}

export function setMachineName(mName: string) {
  machineName = mName;
}
