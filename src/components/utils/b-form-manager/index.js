import cloneDeep from 'lodash/cloneDeep';
import uniqueId from 'lodash/uniqueId';

import { getProxy } from 'b-proxy';
import { addMessage, clearMessages, clearManagementInstance } from 'b-snackbar';
// import { BDevice } from 'b-device';

var data = require('./assets/data/data').default;

function inProd() { return process.env.NODE_ENV == 'production'; }

export class BFormManager {
  static masterPageInstance = null;
  static showDelegate = null;
  static showDialogDelegate = null;
  static setOpenedLinkTabValueDelegate = null;

  static currentLanguage;
  static resourceTree = {};
  static unauthorizedResourceTree = {};
  static resourceInfoList = [];
  static resourceCodeList = [];

  static requestClass = 'BOA.Types.One.AuthorizedResourceRequest';
  static defaultResourceCode = 'YONTBOAONE';

  static staticConstructor(_masterPageInstance, _showDelegate, _showDialogDelegate, _setOpenedLinkTabValueDelegate) {
    this.masterPageInstance = _masterPageInstance;
    this.showDelegate = _showDelegate;
    this.showDialogDelegate = _showDialogDelegate;
    this.setOpenedLinkTabValueDelegate = _setOpenedLinkTabValueDelegate;
  }

  static cacheResourceInfo(_resourceInfo) {
    if (this.resourceInfoList) {
      var isThereInList = false;
      for (var i = 0; i < this.resourceInfoList.length; ++i) {
        if (this.resourceInfoList[i].resourceCode == _resourceInfo.resourceCode) {
          isThereInList = true;
          if (this.resourceInfoList[i].pageParams && this.resourceInfoList[i].pageParams.resourceInfo) {
            this.resourceInfoList[i].pageParams = { resourceInfo: _resourceInfo };
          }
          else {
            this.resourceInfoList[i].pageParams = { resourceInfo: _resourceInfo };
          }
          break;
        }
      }
      if (!isThereInList) {
        _resourceInfo.pageParams = { resourceInfo: Object.assign({}, _resourceInfo) };
        this.resourceInfoList.push(Object.assign({}, _resourceInfo));
      }
    }
    else {
      _resourceInfo.pageParams = { resourceInfo: Object.assign({}, _resourceInfo) };
      this.resourceInfoList.push(Object.assign({}, _resourceInfo));
    }
  }

  static getCachedResourceInfo(_resourceId, _resourceCode, _resourcePath) {
    if (this.resourceInfoList) {
      for (var i = 0; i < this.resourceInfoList.length; ++i) {
        if ((_resourceId && this.resourceInfoList[i].id == _resourceId) || (_resourceCode && this.resourceInfoList[i].resourceCode == _resourceCode) || (_resourcePath && this.resourceInfoList[i].pageName == _resourcePath)) {
          if (this.resourceInfoList[i].pageParams && this.resourceInfoList[i].pageParams.resourceInfo) {
            return this.resourceInfoList[i].pageParams.resourceInfo;
          }
          else {
            return null;
          }
        }
      }
    }
    return null;
  }

  static isOneResource(resourceCode) {
    if (resourceCode) {
      for (var i = 0; i < this.resourceCodeList.length; ++i) {
        if (this.resourceCodeList[i] && this.resourceCodeList[i] === resourceCode) {
          return true;
        }
      }
    }
    return false;
  }

  static setRequestInfo(channelId)
  {
    if (channelId == 45) {
      this.requestClass = 'BOA.Types.One.Corporate.AuthorizedResourceRequest';
      this.defaultResourceCode = 'YONTBOACOR';
    }
  }

  static setOneResourceCodeList(resourceTree) {
    if (resourceTree) {
      for (var i = 0; i < resourceTree.length; ++i) {
        if (resourceTree[i] && resourceTree[i].resourceCode) {
          this.resourceCodeList.push(resourceTree[i].resourceCode);
        }
        if (resourceTree[i].children && resourceTree[i].children.length > 0) {
          this.setOneResourceCodeList(resourceTree[i].children);
        }
      }
    }
  }

  static getAllResourceLightInfo(language, callback) {
    this.currentLanguage = language;
    if (this.resourceTree && this.resourceTree[language]) {
      callback({ success: true, value: cloneDeep(this.resourceTree[language]) });
    }
    else {
      // var requestClass = 'BOA.Types.One.AuthorizedResourceRequest';
      // var request = {
      //   MethodName: 'CallLight',
      //   ResourceId: 0,
      //   ResourceCode: 'YONTBOAONE'
      // };
      // let promise = this._serviceCallInternal(requestClass, request);
      // promise.then((result) => {
      //   if (result.success) {
      //     this.setOneResourceCodeList(result.value);
      //     this.resourceTree[language] = result.value;
      //     callback({ success: true, value: cloneDeep(this.resourceTree[language]) });
      //   }
      //   else {
      //     callback(result);
      //   }
      // }, (error) => {
      //   callback({ success: false, error: error });
      // });

      if (!inProd()) {
        let dataNew=cloneDeep(data);
        this.setOneResourceCodeList(dataNew.value);
      // this.resourceTree[language] = dataNew.value;
        callback(dataNew);
      } else {
        let promise = this._serviceCallInternalManual('/one/', 'getresources'); // todo url değişebilir
        promise.then((result) => {
          if (result.success) {
            this.setOneResourceCodeList(result.value);
            this.resourceTree[language] = result.value;
            callback({ success: true, value: cloneDeep(this.resourceTree[language]) });
          }
          else {
            callback(result);
          }
        }, (error) => {
          callback({ success: false, error: error });
        });
      }
    }
  }

  static getAllResourceListLight(language, callback) {
    this.currentLanguage = language;
    if (this.resourceTree && this.resourceTree[language]) {
      callback && callback({ success: true, value: cloneDeep(this.resourceTree[language]) });
    }
    else {
      var request = {
        MethodName: 'CallLight',
        ResourceId: 0,
        ResourceCode: this.defaultResourceCode
      };
      let promise = this._serviceCallInternal(this.requestClass, request);
      promise.then((result) => {
        if (result.success) {
          this.setOneResourceCodeList(result.value);
          this.resourceTree[language] = result.value;
          callback && callback({ success: true, value: cloneDeep(this.resourceTree[language]) });
        }
        else {
          callback && callback(result);
        }
      }, (error) => {
        callback && callback({ success: false, error: error });
      });
    }
  }

  static saveGridSetting(userCode, resourceCode, setting) {

    // cached
    if (this.resourceInfoList && this.resourceInfoList.length>0) {
      let arrayResourceList= this.resourceInfoList.filter(x=>x.resourceCode==resourceCode);
      if (arrayResourceList && arrayResourceList.length>0) {
        let resource=arrayResourceList[0];
        resource.gridSetting={userGridSetting:setting};
        if (resource.pageParams && resource.pageParams.resourceInfo)
          resource.pageParams.resourceInfo.gridSetting=resource.gridSetting;
      }
    }

    var request = {
      methodName: 'Insert',
      resourceCode: this.defaultResourceCode,
      dataContract:{
        userCode:userCode,
        userGridSetting:setting,
        resourceCode:resourceCode

      }
    };
    let promise = this._serviceCallInternal('BOA.Types.One.UserGridSettingRequest', request);
    promise.then((result) => {
      if (!result.success) {
        console.log(result);
      }
    }, (error) => {
      console.log(error);
    });
  }


  static getUnauthorizedResourceLightInfo(language, callback) {
    if (this.unauthorizedResourceTree && this.unauthorizedResourceTree[language]) {
      callback({ success: true, value: this.unauthorizedResourceTree[language] });
    }
    else {

      var request = {
        MethodName: 'CallUnauthorizedResourceListLight',
        ResourceId: 0,
        ResourceCode: this.defaultResourceCode
      };

      let promise = this._serviceCallInternal(this.requestClass, request);
      promise.then((result) => {
        if (result.success) {
          // this.setOneResourceCodeList(result.value);
          this.unauthorizedResourceTree[language] = result.value;
          callback({ success: true, value: cloneDeep(this.unauthorizedResourceTree[language]) });
        }
        else {
          callback(result);
        }
      }, (error) => {
        callback({ success: false, error: error });
      });
    }
  }

  static getResourceTree(language) { // bappbar kullanılıyor. resourceTree ileride redux'a alınabilir.
    if (this.resourceTree && this.resourceTree[language]) {
      return cloneDeep(this.resourceTree[language]);
    }
    else {
      return null;
    }
  }

  static clearCachedResourceInfo(language) {
    this.resourceInfoList = [];
    this.currentLanguage = language;
  }

  static getResourceInfo(resourceId, resourceCode, callback) {
    let _resourceInfo = this.getCachedResourceInfo(resourceId, resourceCode, null, false);
    if (_resourceInfo) {
      callback({
        success: true,
        value: _resourceInfo,
        message: null
      });
    }
    else {
      let response = this._serviceCallInternal(this.requestClass, {
        methodName: 'GetResourceInfoByResourceInfo',
        pageInfoResourceId: resourceId,
        pageInfoResourceCode: resourceCode
      })
        .done((response) => {
          let errorMessage = null;
          if (response && response.results && response.results[0] && response.results[0].errorMessage) {
            errorMessage = response.results[0].errorMessage;
          }
          if (response.success) {
            this.parseValidation(response);
            response.value.language = this.currentLanguage;
            this.cacheResourceInfo(response.value);
          }
          callback({
            success: response.success,
            value: response.value,
            message: errorMessage,
            response: response
          });
        }).fail((jqXhr, textStatus, errorThrown) => {
          callback({
            success: response.success,
            value: response.value,
            message: errorThrown
          });
        });
    }
  }

  static getResourceInfoByPath(path, callback) {
    let _resourceInfo = this.getCachedResourceInfo(null, null, path, false);
    if (_resourceInfo) {
      callback({
        success: true,
        value: _resourceInfo,
        message: null
      });
    }
    else {
      let response = this._serviceCallInternal(this.requestClass, {
        methodName: 'GetResourceInfoByPath',
        pageInfoPath: path
      })
        .done((response) => {
          let errorMessage = null;
          if (response && response.results && response.results[0] && response.results[0].errorMessage) {
            errorMessage = response.results[0].errorMessage;
          }
          if (response.success) {
            this.parseValidation(response);
            response.value.language = this.currentLanguage;
            this.cacheResourceInfo(response.value);
          }
          callback({
            success: response.success,
            value: response.value,
            message: errorMessage,
            response: response
          });
        }).fail((jqXhr, textStatus, errorThrown) => {
          callback({
            success: response.success,
            value: response.value,
            message: errorThrown
          });
        });
    }
  }

  static parseValidation(response) {
    if (response.value && response.value.validationInfo) {
      response.value.validationInfo.forEach((validation) => {
        validation.fields = this.copyAllFields(validation.fields);
        validation.fieldValidations = validation.fieldValidations ? JSON.parse(validation.fieldValidations) : [];
        validation.groupValidations = validation.groupValidations ? JSON.parse(validation.groupValidations) : [];
        validation.businessValidations = validation.businessValidations ? JSON.parse(validation.businessValidations) : [];
      });
    }
  }

  static copyAllFields(fields) {
    var response = [];
    if (fields != null && fields.length > 0) {
      var newField;
      for (var i = 0; i < fields.length; i++) {
        newField = {};
        newField.name = fields[i].code;
        newField.path = fields[i].requestPath;
        newField.componentReference = fields[i].componentReference;
        response.push(newField);
      }
    }
    return response;
  }

  static getNewPageId() {
    if (this.masterPageInstance && this.masterPageInstance.bAppBar) {
      return this.masterPageInstance.bAppBar.getInstance().getPageId();
    } else {
      return uniqueId();
    }
  }

  static getTabList() {
    return this.masterPageInstance.state.tabs;
  }

  static show(resourceCode, data, showAsNewPage, menuItemSuffix, openType = 0, forceWPF = false) {
    if (BFormManager.isOneResource(resourceCode) && this.masterPageInstance.state.context.applicationContext.isBOALogin != true) { // boa one kaynağı var boa'nın içinde açılmıyorsa
      this.showDelegate && this.showDelegate(resourceCode, data, showAsNewPage, menuItemSuffix); // boa one web
    }
    else if (BFormManager.isOneResource(resourceCode) && this.masterPageInstance.state.context.applicationContext.isBOAStoreLogin == true ) { // boa one kaynağı var boa'nın içinde açılmıyorsa
      this.showDelegate && this.showDelegate(resourceCode, data, false, menuItemSuffix); // boa store
    } else { // boa container desktop
      // BDevice.transferToBOAContainer('OpenTab', {
      //   ResourceCode: resourceCode,
      //   OpenType: openType,
      //   FormNameSuffix: menuItemSuffix,
      //   ShowAsNewWindow: showAsNewPage,
      //   Data: data,
      //   ForceWPF: forceWPF
      // });
    }
  }

  static showDialog(resourceCode, data, title, onClose, style) {
    this.showDialogDelegate && this.showDialogDelegate(resourceCode, data, title, onClose, style);
  }

  static fullScreen(makeFull) {
    if (this.masterPageInstance && this.masterPageInstance.bAppBar)
      this.masterPageInstance.bAppBar.getInstance().fullScreen(makeFull);
  }

  static showStatusMessage(text, closeText = '', closeCallback = null, type = '', timeout = 5000, color = '') {
    addMessage && addMessage('b-page-host', text, closeText, closeCallback, type, timeout, color);
  }

  static showStatusErrorMessage(text, results, closeText = '', closeCallback = null, type = '', timeout = 5000, color = '') {
    var errorMessage = '';
    if (text) {
      errorMessage = text + '\n\n';
    }
    if (results && results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        errorMessage += results[i].errorMessage;
        if (i < results.length - 1) {
          errorMessage += '\n';
        }
      }
    }
    addMessage && addMessage('b-page-host', errorMessage, closeText, closeCallback, type, timeout, color);
  }

  static showStatusDeleteMessage(text, undoText = 'Geri al', deleteCallback, undoCallback, timeout = 5000, type = '') {
    if (addMessage) {
      var timer = setTimeout(deleteCallback, (timeout || 5000) + 100); // tam snackbar kapandıktan sonra silsin, +100 o nedenle.
      const _undoCallback = () => {
        clearTimeout(timer);
        undoCallback && undoCallback();
      };
      addMessage('DeleteMessage', text, undoText, _undoCallback, type, timeout);
    }
  }

  static clearManagementInstance() {
    clearManagementInstance && clearManagementInstance();
  }

  static showStatusMessageOnOther(uniqueId, text, closeText = '', closeCallback = null, type = '', timeout = 5000, color = '') {
    addMessage && addMessage(uniqueId, text, closeText, closeCallback, type, timeout, color);
  }

  static clearStatusMessage() {
    clearMessages && clearMessages();
  }

  static setOpenedLinkTabValue(menuItemProps) {
    this.setOpenedLinkTabValueDelegate && this.setOpenedLinkTabValueDelegate(menuItemProps);
  }

  static _serviceCallInternal(requestClass, requestBody) {
    if (getProxy()) {
      return getProxy().call(requestClass, requestBody);
    }
    else {
      throw 'b-framework proxy instance not set';
    }
  }

  static _serviceCallInternalManual(baseUrl, servicePath, method = 'POST', contentType = 'application/json', data = {}) {
    if (getProxy()) {
      return getProxy().callManual({ baseUrl, servicePath, method, contentType, data });
    }
    else {
      throw 'b-framework proxy instance not set';
    }
  }
}
