import * as React from 'react';
import { store } from '../store';
import reducerRegistery from '../reducer';
import routeManager, { routeActions } from '../router';
import { subscribe, unsubscribe } from '../middleware';
import * as Actions from '../action';
import { BComponent, Utils } from 'b-component';
import { BBaseForm } from 'b-base-form';
import { BFormManager } from 'b-form-manager';
import { BValidator } from 'b-validator';
import { BDialogHelper } from 'b-dialog-box';
import { setUIProxy } from 'b-ui-proxy';
import { pushUIProxy } from 'b-ui-proxy';
import { popUIProxy } from 'b-ui-proxy';
import { BpmActionManager } from 'b-bpm-action-manager';
import { BActionManager } from 'b-action-manager';
import { BLoading } from 'b-loading';

export default class BasePage extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.snaps = {};
    this.extraBpmActionList = [];
    const proxyDelegates = {
      proxyExecute: this.proxyExecute.bind(this),
      proxyMultipleExecute: this.proxyMultipleExecute.bind(this),
      proxyReportExecute: this.proxyReportExecute.bind(this),
      proxyTransactionExecute: this.proxyTransactionExecute.bind(this)
    };
    if (props.inDialog) {
      pushUIProxy(proxyDelegates);
    } else {
      setUIProxy(proxyDelegates);
    }
    this.onPageActionClick = this.onPageActionClick.bind(this);
    this.onPageCloseClick = this.onPageCloseClick.bind(this);

  }

  isStepper:boolean = false;

  onPageActionClick(e, callBack) {
    this.activeAction = e;
    if (this.onActionClick) {
      return this.onActionClick(e, callBack);
    }
  }

  onPageChangeViewClick(e, formMode) {

    if (this.pageId !== undefined) {
      /* sayfaların state'lerinin saklanması için yapıldı. */
      let snapshot = this.getSnapshot();
      this.saveSnapshot(snapshot);
    }

    this.setState({
      formMode:formMode
    }, ()=>{
      this.saveSettings();
      if (this.onChangeViewClick) {
         this.onChangeViewClick(e, formMode);
      }
    });

  }

  onPageCloseClick() {
    // chrome,safari, firefoxta bu çalışıyor.
    window.dispatchEvent(new Event('pageclose', {
      bubbles: true,
      cancelable: true
    }));
  }


  onClose() {
    if (this.props.inDialog) {
      popUIProxy();
    }
  }

  dispatchAction(action) {
    if (action.rpath && this.pageId !== undefined) {
      action.rpath = action.rpath + this.pageId;
    }
    store.dispatch(action);
  }

  connect(cmpRef, pageReducers = null, initialState = {}) {
    let defaultState = { executer: { isLoading: false } };
    this.pageId = !this.props.inDialog ? routeManager.getCurrentPageId() : routeManager.getCurrentDialogId();
    this.subscriptions = [];
    var reducertags = [];
    if (pageReducers) {
      var newReducer = {};
      for (var i = 0; i < pageReducers.length; i++) {
        // this.pageId = routeManager.getCurrentPageId();
        var pageReducer = pageReducers[i];
        if (this.pageId !== undefined) {
          newReducer[pageReducer.name + this.pageId] = pageReducer;
        } else {
          newReducer[pageReducer.name] = pageReducer;
        }
      }
      reducerRegistery.register(newReducer);
      for (var reducertag in newReducer) {
        reducertags.push(reducertag);
        var reducerkey = reducerRegistery.getIncrement();
        this.subscriptions.push({ path: reducertag, key: reducerkey });
        subscribe(reducertag, reducerkey, (payload) => {
          var currentState = store.getState();
          cmpRef.setState(currentState[payload.path]);
        });
      }
    }
    var currentState = store.getState();
    var storeobjects = {};
    for (var commontag in reducerRegistery.getStaticReducers()) {
      storeobjects[commontag] = currentState[commontag];
      var key = reducerRegistery.getIncrement();
      this.subscriptions.push({ path: commontag, key: key });
      subscribe(commontag, key, (payload) => {
        // executer ise sadece ilgili ekranda setState yap.
        if (payload.path == 'executerStore') {
          const currentPageId = !cmpRef.props.inDialog ? routeManager.getCurrentPageId() : routeManager.getCurrentDialogId();
          if (cmpRef.pageId !== undefined && cmpRef.pageId == currentPageId) {
            const pageExecuter = payload.next[cmpRef.pageId];
            cmpRef.updateLoadingState(pageExecuter);
            cmpRef.raiseExecutions(pageExecuter);
            cmpRef.raiseComponentExecutions(pageExecuter);
            cmpRef.raiseDialogExecutions(pageExecuter);
          }
          // cmpRef.setState({ executer: { ...payload.next[cmpRef.pageId] } });
        }
        else {
          var currentState = store.getState();
          var stateobj = {};
          stateobj[payload.path] = currentState[payload.path];
          cmpRef.setState(stateobj); // todo bütün sayfaları rerender eder. !
        }
      });
    }
    for (i = 0; i < reducertags.length; i++) {
      Object.assign(storeobjects, currentState[reducertags[i]]);
    }
    const pageParams = !cmpRef.props.inDialog ? routeManager.getPageParams() : routeManager.getDialogParams();
    cmpRef.state = { ...storeobjects, ...initialState, pageParams, ...defaultState };
    Object.assign(cmpRef, routeActions);
    return reducertags;
  }

  getValueFromComponent(componentName, propertyName) {
    let component = this.snaps[componentName];
    let result;
    if (component) {
      if (propertyName === 'value') {
        result = component.getValue();
        if (result && result.value) {
          result = result.value;
        }
      } else {
        result = this.getSubValue(component.getValue(), propertyName);
      }
    }
    return result;
  }

  getSubValue(componentValue, propertyName) {
    if (!propertyName || !componentValue)
      return null;

    if (propertyName.includes('.')) {
      var newProperty = propertyName.substring(propertyName.indexOf('.') + 1, propertyName.length);
      var nested = propertyName.split('.')[0];
      return this.getSubValue(componentValue[nested], newProperty);
    }
    return componentValue[propertyName];
  }

  checkOperandsWithOperator(operand1, operand2, operator) {
    switch (operator) {
      case 1:
        // Equal
        if (operand1 == operand2) {
          return true;
        }
        return false;
      case 2:
        // Not Equal
        if (operand1 != operand2) {
          return true;
        }
        return false;
    }
    return false;
  }

  dynamicEventBase(e) {
    var dynamicProps = Object.assign({}, this.state.dynamicProps);

    var componentInteraction = this.state.pageParams.resourceInfo.componentInteractionInfo.find(x => x.effectedComponent == e.name && x.effectedEvent == e.event);
    if (componentInteraction) {
      componentInteraction.interactionConditionList.forEach(condition => {

        var operand1 = condition.operand1Value;
        if (condition.operand1Type == 1) {
          // get value from component
          var componentName = operand1.split('.')[0];
          var propertyName = operand1.split('.')[1]; // TODO: complex proplar için bunun substring olması gerekecek. şimdilik böyle kalsın
          operand1 = this.getValueFromComponent(componentName, propertyName);
        }

        var operand2 = condition.operand2Value;
        if (condition.operand2Type == 1) {
          // get value from component
          componentName = operand2.split('.')[0];
          propertyName = operand2.split('.')[1]; // TODO: complex proplar için bunun substring olması gerekecek. şimdilik böyle kalsın
          operand2 = this.getValueFromComponent(componentName, propertyName);
        }

        if (this.checkOperandsWithOperator(operand1, operand2, condition.operator)) {
          condition.assignmentList.forEach(assignment => {
            var assignedComponentName = assignment.assignedComponentProperty.split('.')[0];
            var assignedPropertyName = assignment.assignedComponentProperty.split('.')[1];// TODO: complex proplar için bunun substring olması gerekecek. şimdilik böyle kalsın
            if (!dynamicProps[assignedComponentName]) {
              dynamicProps[assignedComponentName] = {};
            }

            var propertyValue = assignment.sourceValue;
            if (assignment.sourceType == 1) {
              // get value from component
              componentName = propertyValue.split('.')[0];
              propertyName = propertyValue.split('.')[1]; // TODO: complex proplar için bunun substring olması gerekecek. şimdilik böyle kalsın
              propertyValue = this.getValueFromComponent(componentName, propertyName);
            }

            dynamicProps[assignedComponentName][assignedPropertyName] = propertyValue;
          });
        }

      });
    }
    this.setState({ dynamicProps });
  }

  componentWillMount() {
    if (this.state) {
      this.state.snapshot = {};
      this.state.errors = {}; // validation errors
      this.validator = new BValidator(this.state.context);

      if (
          this.state.context.applicationName &&
          this.state.context.applicationName == 'BOAOneCorporate' ) {
        BFormManager.setRequestInfo(45);
      }

      if (!this.state.dynamicProps) {
        this.state.dynamicProps = this.getDynamicProps(this.state.pageParams);
      }

      if (this.pageId !== undefined) {
        this.organizeSnapshot();
        // const pageExecuter = store.getState().executerStore[this.pageId];
        // if (pageExecuter) {
        //   // this.updateLoadingState(pageExecuter);  // didMount'da loading güncelleniyor, gerek yok gibi.
        //   this.raiseExecutions(pageExecuter);
        // }
        if (window.location.hash != '#/dynamic/dashboard/RPTRCIODSH') { // geçiciolarak konuldu. coral
          if (this.state.context.applicationName == 'BOAOneOffice' ||
              this.state.context.applicationName == 'BOAOneCorporate') {
            if (!this.state.pageParams || !this.state.pageParams.resourceInfo) { // todo buranın dışarıdan exclue olarak enjekte edilmesi gerekmektedir.
              if (this.constructor.name != 'MasterPage' && this.constructor.name != 'PortalPage' && window.location.hash != '#/auth/portal') {
                this.applyResourceInfoByPath(window.location.hash);
              }
              else if (this.constructor.name == 'PortalPage' && window.location.hash == '#/auth/portal') {
                this.setState({ pageParams: Object.assign({}, { resourceInfo: { pageName: '/portal' } }) });
              }
            }
            else if (this.state.pageParams && this.state.pageParams.resourceInfo && !this.state.pageParams.resourceInfo.resourceActionList) {
              if (this.constructor.name != 'PortalPage' && window.location.hash != '#/auth/portal') {
                this.applyResourceInfoByResourceInfo(this.state.pageParams.resourceInfo.id);
              }
            }
            // container üzerinden açıldığı durumda boş geliyor.
            if ( BFormManager.resourceCodeList==null ||
                BFormManager.resourceCodeList.length == 0 ) {
              BFormManager.getAllResourceListLight(this.state.context.language);
            }
          }
        }
      }

    }
  }

  componentWillReceiveProps() {
    if (this.state.pageParams && this.state.pageParams.resourceInfo && this.state.pageParams.resourceInfo.language &&
      (this.state.context.language != this.state.pageParams.resourceInfo.language)) {
      if (this.constructor.name != 'PortalPage' && window.location.hash != '#/auth/portal') {
        const _resourceInfo = Object.assign({}, this.state.pageParams.resourceInfo, { resourceActionList: [] });
        const _pageParams = Object.assign({}, this.state.pageParams, { resourceInfo: _resourceInfo });
        this.setState({ pageParams: _pageParams });
        this.applyResourceInfoByResourceInfo(this.state.pageParams.resourceInfo.id);
      }
    }
  }

  componentWillUnmount() {
    if (this.subscriptions && this.subscriptions.length > 0) {
      for (var i = 0; i < this.subscriptions.length; i++) {
        unsubscribe(this.subscriptions[i].path, this.subscriptions[i].key);
      }
    }
    if (this.pageId !== undefined) {
      /* sayfaların state'lerinin saklanması için yapıldı. */
      let snapshot = this.getSnapshot();
      this.saveSnapshot(snapshot);
    }
  }

  componentDidMount() {
    if (this.state) {
      if (this.pageId !== undefined) {
        const pageExecuter = store.getState().executerStore[this.pageId];
        if (pageExecuter) {
          this.updateLoadingState(pageExecuter);
          this.raiseComponentExecutions(pageExecuter);
          this.raiseExecutions(pageExecuter);
        }
      }
    }
  }

  /* Snapshot */
  organizeSnapshot() {
    this.state.snapshot = {};
    if (this.state.snapshotStore && this.state.snapshotStore[this.pageId]) {
      this.setSnapshot(this.state.snapshotStore[this.pageId]);
    }
    else if (this.state.pageParams && this.state.pageParams.data && this.state.pageParams.data.initialSnapshot) {
      this.setSnapshot(this.state.pageParams.data.initialSnapshot);
    }
  }

  getSnapshot() {
    let snapshot = {};
    snapshot.snaps = {};
    for (var name in this.snaps) {
      if (this.snaps[name] && this.snaps[name].getInstance && this.snaps[name].getInstance().getSnapshot) {
        snapshot.snaps[name] = this.snaps[name].getInstance().getSnapshot();
      }
    }
    // TODO: static reducer'dan okunacak şekilde düzenlenecek
    // eslint-disable-next-line no-unused-vars
    const { context, routing, snapshotStore, executerStore, snaps, ...otherState } = this.state;
    snapshot.state = { ...otherState };
    snapshot.validator = this.validator;
    snapshot.actionManager = this.snaps.actionManager && this.snaps.actionManager.getInstance && this.snaps.actionManager.getInstance().getSnapshot();
    return snapshot;
  }

  setSnapshot(snapshot) {
    if (this.state) {
      this.state = Object.assign({}, this.state, snapshot.state, { snapshot: snapshot.snaps, actionManagerSnap: snapshot.actionManager });
      this.validator = snapshot.validator;
    }
  }

  saveSnapshot(snapshot) {
    store.dispatch({
      type: Actions.SAVE_SNAPSHOT,
      payload: {
        pageId: this.pageId,
        data: snapshot
      }
    });
  }

  getSnapKey(childSnapKey) {
    return this.props.snapKey ? `${this.props.snapKey}_${childSnapKey}` : childSnapKey;
  }

  /* Proxy Executer */
  proxyExecute(proxyRequest, callback) {
    const requestBag = this.getRequestBag(proxyRequest);
    if (callback) {
      requestBag.params = requestBag.params || {}; // params üzerinden callback tutuldu. params taşındığından.
      requestBag.params.callback = callback;
    }
    return Actions.executeBegin(requestBag);
  }

  proxyMultipleExecute(proxyRequest) {
    const requestBag = this.getRequestBag(proxyRequest);
    return Actions.executeBegin(requestBag);
  }

  proxyReportExecute(proxyRequest) {
    const requestBag = this.getRequestBag(proxyRequest);
    return Actions.executeReportBegin(requestBag);
  }

  proxyTransactionExecute(proxyRequest, callback) {
    const requestBag = this.getRequestBag(proxyRequest);
    if (callback) {
      requestBag.params = requestBag.params || {}; // params üzerinden callback tutuldu. params taşındığından.
      requestBag.params.callback = callback;
    }
    return Actions.executeTransactionBegin(requestBag);
  }

  getResponseBag(proxyResponse) {
    const { requestList, requestClass, requestBody, key, response, snapKey, dialogKey, params, componentRef } = proxyResponse;
    return { requestList, requestClass, requestBody, key, response, snapKey, dialogKey, params, componentRef };
  }

  getRequestBag(proxyRequest) {
    const { requestList, requestClass, requestBody, proxyTimeout, key, showProgress, snapKey, dialogKey, params, path, componentRef } = proxyRequest;
    requestList ? this.setRequestListInformation(requestList) : this.setRequestInformation(requestBody);
    return {
      requestList: requestList,
      requestClass: requestClass,
      requestBody: requestBody,
      proxyTimeout: proxyTimeout,
      key: key,
      showProgress: showProgress==false ? false: true,
      pageId: this.pageId,
      snapKey: snapKey,
      dialogKey: dialogKey,
      params: params,
      path: path,
      componentRef: componentRef // b-business-component de set ediliyor
    };
  }

  setRequestInformation(requestBody) {
    if (this.state && this.state.pageParams && this.state.pageParams.resourceInfo) {
      requestBody.resourceId = this.state.pageParams.resourceInfo.id;
    }
    if (this.activeAction) {
      requestBody.actionId = this.activeAction.actionId;
    }
  }

  setRequestListInformation(requestList) {
    if (requestList && requestList.length > 0) {
      requestList.forEach(function (request) {
        request.type = request.requestClass;
        request.body = request.requestBody;
        request.requestClass = null;
        request.requestBody = null;
        if (this.state && this.state.pageParams && this.state.pageParams.resourceInfo) {
          request.resourceId = this.state.pageParams.resourceInfo.id;
        }
        if (this.activeAction) {
          request.actionId = this.activeAction.actionId;
        }
      }, this);
    }
  }

  // eslint-disable-next-line no-unused-vars
  proxyDidRespond(proxyResponse) { }

  updateLoadingState(executerStore) {
    if (this.snaps.form) {
      this.hasPendingExecution(executerStore) ? this.snaps.form.getInstance().showProgress() : this.snaps.form.getInstance().hideProgress();
    }
    // if (this.form) {
    //   this.hasPendingExecution(executerStore) ? this.form.showProgress() : this.form.hideProgress();
    // } else if (this.snaps.browseform) {
    //   this.hasPendingExecution(executerStore) ? this.snaps.browseform.getInstance().showProgress() : this.snaps.browseform.getInstance().hideProgress();
    // }
  }

  hasPendingExecution(executerStore, isTransactional = false) {
    if (executerStore && executerStore.executionPool) {
      for (let requestKey in executerStore.executionPool) {
        const request = executerStore.executionPool[requestKey];
        if (request.isPending && request.showProgress && (!isTransactional || (isTransactional && request.isTransactional))) {
          return true;
        }
      }
    }
    return false;
  }

  hasPendingTransactionalExecution(executerStore) {
    return this.hasPendingExecution(executerStore, true);
  }

  raiseExecutions(executerStore) {
    if (this.proxyDidRespond) {
      let executions = this.popPageExecutions(executerStore);
      for (let i = 0; i < executions.length; i++) {
        if (executions[i].key.startsWith('VALIDATION_') && this.validator && this.validator.proxyDidRespond)
          this.validator.proxyDidRespond(executions[i]);
        else {
          this.proxyDidRespond(executions[i]);
          this.proxyDidRespondCallback(this, executions[i]);
        }
      }
    }
  }

  raiseComponentExecutions(executerStore) {
    if (this.snaps) {
      let executions = this.popPageExecutions(executerStore, true);
      for (let i = 0; i < executions.length; i++) {
        let execution = executions[i];
        const component = execution.componentRef ? execution.componentRef : this.findComponent(execution.snapKey, this);
        component && component.proxyDidRespond && component.proxyDidRespond(execution);
        component && this.proxyDidRespondCallback(component, execution);
      }
    }
  }

  raiseDialogExecutions(executerStore) {
    if (BDialogHelper.dialogRefs) {
      let executions = this.popPageExecutions(executerStore, false, true);
      for (let i = 0; i < executions.length; i++) {
        const component = BDialogHelper.dialogRefs[executions[i].dialogKey];
        component && component.contentRef && component.contentRef.proxyDidRespond && component.contentRef.proxyDidRespond(executions[i]);
        component && component.contentRef && this.proxyDidRespondCallback(component.contentRef, executions[i]);
      }
    }
  }

  proxyDidRespondCallback(superRef, propxyResponse) {
    if (propxyResponse.params && propxyResponse.params.callback) {
      const callback = propxyResponse.params.callback.bind(superRef);
      callback(propxyResponse.response);
      delete propxyResponse.params.callback;
    }
  }

  findComponent(snapKey: string, parentComponent, snapKeyArray: Array<string>) {
    if (snapKey && !snapKeyArray) {
      snapKeyArray = snapKey.split('_');
      snapKey = snapKeyArray.shift();
    }

    let component;
    if (parentComponent[snapKey]) {
      component = parentComponent[snapKey];
    } else if (parentComponent.snaps && parentComponent.snaps[snapKey]) {
      component = parentComponent.snaps[snapKey];
    }
    if (snapKeyArray && snapKeyArray.length > 0) {
      return this.findComponent(snapKeyArray.shift(), component, snapKeyArray);
    }
    return component;
  }

  popPageExecutions(pageExecuter, fromComponent = false, fromDialog = false) {
    const returnArray = [];
    if (pageExecuter && pageExecuter.executionPool) {
      let execution;
      for (let requestKey in pageExecuter.executionPool) {
        execution = pageExecuter.executionPool[requestKey];
        if (!execution.isPending) {
          if (
            (!fromComponent && !fromDialog && !execution.snapKey && !execution.componentRef && !execution.dialogKey) ||
            (fromComponent && execution.snapKey) ||
            (fromDialog && execution.dialogKey) ||
            ((fromComponent || fromDialog) && execution.componentRef)
          ) {
            const responseBag = this.getResponseBag(execution);
            returnArray.push(responseBag);
            delete pageExecuter.executionPool[requestKey];
          }
        //   if ((!execution.componentRef && (!fromComponent && !fromDialog && !execution.snapKey && !execution.dialogKey)) ||
        //     (fromComponent && execution.snapKey) ||
        //     (fromDialog && execution.dialogKey)
        //   ) {
        //     const responseBag = this.getResponseBag(execution);
        //     returnArray.push(responseBag);
        //     delete pageExecuter.executionPool[requestKey];
        //   } else if (fromComponent || fromDialog) {
        //     const responseBag = this.getResponseBag(execution);
        //     returnArray.push(responseBag);
        //     delete pageExecuter.executionPool[requestKey];
        //   }
        }
      }
    }
    returnArray.sort((a, b) => {
      return (a.endDate > b.endDate) ? 1 : ((a.endDate < b.endDate) ? -1 : 0);
    });

    return returnArray;
  }

  /* Validation */
  validate(model, parameter) {
    let schema = this.findSchema(parameter);
    let errors = this.validator.validate(model, schema) || {};
    this.setState({ errors });
    return Object.keys(errors).length === 0;
  }

  validateAsync(model, parameter, validationCallback) {
    let schema = this.findSchema(parameter);
    this.validator.validateAsync(model, schema, (isValid, errors) => {
      this.setState({ errors });
      validationCallback(isValid, errors);
    });
  }

  validateAsyncTest(request, validationCallback) {
    this.validator.validateAsyncTest(request, (isValid, errors) => {
      this.setState({ errors });
      validationCallback(isValid, errors);
    });
  }

  findSchema(parameter) {
    const typeOfParameter = typeof parameter;
    const validationInfo = this.state.pageParams && this.state.pageParams.resourceInfo ? this.state.pageParams.resourceInfo.validationInfo || [] : [];
    const resourceActionList = this.state.pageParams && this.state.pageParams.resourceInfo ? this.state.pageParams.resourceInfo.resourceActionList || [] : [];

    switch (typeOfParameter) {
      case 'number': {
        return validationInfo.find(x => x.actionId === parameter);
      }
      case 'string': {
        const command = resourceActionList.find(x => x.commandName === parameter);
        if (command) {
          return validationInfo.find(x => x.actionId === command.actionId);
        }
        return null;
      }
      default: return parameter;
    }
  }

  /* ValueConstraint */
  validateConstraint() {
    let result = true;
    for (var name in this.snaps) {
      if (this.snaps[name] && this.snaps[name].getInstance().validateConstraint) {
        result = this.snaps[name].getInstance().validateConstraint() && result;
      }
    }
    return result;
  }

  /* BPM */
  getWindowRequest() {
    return this.windowRequest ? this.windowRequest : { type: null, body: null };
  }

  setWindowRequest(request) {
    this.windowRequest = request;
  }

  getExtraBpmActionList() {
    return this.extraBpmActionList;
  }

  addExtraBpmAction(commandName) {
    this.extraBpmActionList.push(commandName);
  }

  applyResourceInfoByResourceInfo(resourceId = null, resourceCode = null) {

    BFormManager.getResourceInfo(resourceId, resourceCode, (resourceData) => {
      if (!resourceData || !resourceData.success || !resourceData.value) {
        if (resourceData && resourceData.response && resourceData.response.results) {
          this.showDialogErrorMessage(resourceData.response.results);
        }
        else {
          this.showDialogMessage(`Resource bilgisi alınamadı: ${resourceId || resourceCode}`);
        }
        return;
      }
      const _pageParams = Object.assign({}, this.state.pageParams, { resourceInfo: resourceData.value });
      var dynamicProps = this.getDynamicProps(_pageParams);
      this.setState({ pageParams: _pageParams, dynamicProps });
    });
  }


  setPropertyValue(body, name, value) {
    if (!body) {
      return;
    }

    if (name.includes('.')) {
      var newProperty = name.substring(name.indexOf('.') + 1, name.length);
      var nested = name.split('.')[0];
      if (!body[nested]) {
        body[nested] = {};
      }
      this.setPropertyValue(body[nested], newProperty, value);
    } else {
      body[name] = value;
    }
  }

  getDynamicProps(pageParams) {
    var dynamicProps = {};
    if (pageParams &&
      pageParams.resourceInfo &&
      pageParams.resourceInfo.componentSetupInfo) {
      // TODO: if akıştan açılıyorsa değerleri ezmememiz gerekiyor

      pageParams.resourceInfo.componentSetupInfo.forEach(component => {
        if (component.componentName.indexOf('.') != -1) {
          component.initializedPropertyList.forEach(property => {
            var name = component.componentName + '.' + property.propertyName;
            this.setPropertyValue(dynamicProps, name, property.propertyValue);
          });
        }
        else {
          if (!dynamicProps[component.componentName]) {
            dynamicProps[component.componentName] = {};
          }

          component.initializedPropertyList.forEach(property => {
            dynamicProps[component.componentName][property.propertyName] = property.propertyValue;
          });
        }
      });

      pageParams.resourceInfo.componentInteractionInfo.forEach(component => {
        if (!dynamicProps) {
          dynamicProps = {};
        }
        if (!dynamicProps[component.effectedComponent]) {
          dynamicProps[component.effectedComponent] = {};
        }
        dynamicProps[component.effectedComponent]['onDynamicChange'] = this.dynamicEventBase.bind(this);
      });
      // Static ekranlarıdaki bileşenleri dinamik değiştirmek için
    }
    return dynamicProps;
  }

  applyResourceInfoByPath(path) {
    BFormManager.getResourceInfoByPath(path, (resourceData) => {
      if (!resourceData || !resourceData.success || !resourceData.value) {
        if (resourceData && resourceData.response && resourceData.response.results) {
          this.showDialogErrorMessage(resourceData.response.results);
        }
        else {
          this.showDialogMessage(`Resource bilgisi alınamadı: ${path}`);
        }
        return;
      }
      const _pageParams = Object.assign({}, this.state.pageParams, { resourceInfo: resourceData.value });
      BFormManager.setOpenedLinkTabValue(Object.assign({}, resourceData.value));
      this.setState({ pageParams: _pageParams });
    });
  }

  showDialogMessage(text, dialogType = BComponent.DialogType.INFO, dialogResponseStyle = BComponent.DialogResponseStyle.OK, title, onClose) {
    BDialogHelper.show(this.state.context, text, dialogType, dialogResponseStyle, title, onClose);
  }

  showDialogErrorMessage(results, dialogType = BComponent.DialogType.INFO, dialogResponseStyle = BComponent.DialogResponseStyle.OK, title, onClose) {
    BDialogHelper.showError(this.state.context, results, dialogType, dialogResponseStyle, title, onClose);
  }

  showStatusMessage(text, closeText = '', closeCallback = null, type = '', timeout = 5000, color = '') {
    BFormManager.showStatusMessage(text, closeText, closeCallback, type, timeout, color);
  }

  clearStatusMessage() {
    BFormManager.clearStatusMessage();
  }

  setDisable(isDisabled) {
    // this.form && this.form.setDisable(isDisabled);
    this.snaps.form && this.snaps.form.setDisable(isDisabled);
    this.setState({ disabled: isDisabled });
  }

  setStepper(state: boolean) {
    this.isStepper = state;
  }

  createActionManager() {
    if (this.state.pageParams
      && this.state.pageParams.resourceInfo
      && this.state.pageParams.resourceInfo.resourceActionList
      && this.state.pageParams.resourceInfo.resourceActionList.length > 0) {
      const { resourceInfo } = this.state.pageParams;
      const params = {
        context: this.state.context,
        resourceInfo: resourceInfo,
        page: this,
        inDialog: this.props.inDialog,
        snapshot: this.state.actionManagerSnap,
      };

      const setting=this.getUserSettings && this.getUserSettings();
      let formMode;
      if(this.state.formMode){
        formMode=this.state.formMode;
      }
      else if(setting && setting.formMode){
        formMode=setting.formMode;
        this.state.formMode=formMode;
      }

      /**
      * actionManager
      * 0 : StandartActionManager
      * 1 : WorkflowActionManager
      */
      let actionManager = 0;

      if (resourceInfo.openedBy == 0) { /* ResourceOpenSource.Normal */
        if (resourceInfo.isWorkflow) {
          actionManager = 1;
        }
        // else if (this.resourceInfo.isRevokable) Aqww{
        //   actionManager = 'RevokableTransactionActionManager';
        // }
        else {
          actionManager = 0;
        }
      }
      else if (resourceInfo.openedBy == 1) { /* ResourceOpenSource.Workflow */
        // if ((this.resourceInfo.isWorkflow || this.resourceInfo.isRevokable) && this.resourceInfo.openState == 2) {
        //   actionManager = 'ExploreModeActionManager';
        // }
        if (resourceInfo.isWorkflow) {
          actionManager = 1;
        }
      }

      if (!this.isStepper || (this.isStepper && !this.hideActionManager)) {
        if (actionManager === 1) {
          return (
            <BpmActionManager
              ref={r => this.snaps.actionManager = r}
              snapshot={this.state.snapshot['actionManager']}
              snapKey={this.getSnapKey('actionManager')}
              onCloseClick={this.onPageCloseClick.bind(this)}
              onActionClick={this.onPageActionClick && this.onPageActionClick.bind(this)}
              visibleChangeViewButton={this.rowRenderer}
              formMode={formMode}
              onChangeViewClick={this.onPageChangeViewClick && this.onPageChangeViewClick.bind(this)}
              {...params} />
          );
        }
        else {
          return (
            <BActionManager
              ref={(r) => this.snaps.actionManager = r}
              onCloseClick={this.onPageCloseClick.bind(this)}
              onActionClick={this.onPageActionClick && this.onPageActionClick.bind(this)}
              visibleChangeViewButton={this.rowRenderer}
              formMode={formMode}
              onChangeViewClick={this.onPageChangeViewClick && this.onPageChangeViewClick.bind(this)}
              {...params} />
          );
        }
      }
    }
  }

  enableAction(commandName) {
    this.snaps.actionManager && this.snaps.actionManager.enableAction(commandName);
  }

  disableAction(commandName) {
    this.snaps.actionManager && this.snaps.actionManager.disableAction(commandName);
  }

  hideAction(commandName) {
    this.snaps.actionManager && this.snaps.actionManager.hideAction(commandName);
  }

  addAction(action:any) {
    this.snaps.actionManager && this.snaps.actionManager.addAction(action);
  }

  getBpmDescription() {
    if (this.snaps.actionManager) {
      return this.snaps.actionManager.getBpmDescription();
    }
  }

  resultErrorListToString(resultList) {
    let message = ' ';
    if (resultList && resultList.length > 0) {
      resultList.forEach((item) => {
        message += item.errorMessage;
      }, this);
    }
    return message;
  }


  /**
   * getUserSettings
   */
  getUserSettings(){
    let settings;
    if(this.state.pageParams.resourceInfo.gridSetting &&
      this.state.pageParams.resourceInfo.gridSetting.userGridSetting ){
        settings=JSON.parse(this.state.pageParams.resourceInfo.gridSetting.userGridSetting)
      }
    return settings;
  }

  /**
   * saveGridSettings
   */
  saveSettings(){
    if(this.state.pageParams &&
      this.state.pageParams.resourceInfo &&
      this.snaps.form &&
      this.snaps.form!=null
    ){
      let isMobile = Utils.isMobile(this.state);
      let oldSettings=this.getUserSettings();
      let formMode=this.snaps.actionManager && this.snaps.actionManager.state &&  this.snaps.actionManager.state.formMode;
      let newGridSettings= this.snaps.form.getUserSettings && this.snaps.form.getUserSettings();
      let gridSettings;
      if(formMode=='card'){ //  || isMobile
       gridSettings=  oldSettings;
      }
      else{
        gridSettings= newGridSettings==null ? oldSettings : newGridSettings;
      }
      BFormManager.saveGridSetting(
        this.state.context.applicationContext.user.userName,
        this.state.pageParams.resourceInfo.resourceCode,
        JSON.stringify({
          ...gridSettings,
          formMode:formMode


        })
      );
    }
  }
}



export function BasePageComposer(WrappedComponent) {
  return class IIBasePage extends WrappedComponent {
    render() {
      if (this.state.pageParams && this.state.pageParams.resourceInfo && this.state.pageParams.resourceInfo.resourceActionList) {
        const render = super.render();
        let renderContent = null;
        if (render && render.props) {
          renderContent = render.props.children;
        }
        return (
          <BBaseForm
            ref={r => this.snaps.form = r}
            snapshot={this.state.snapshot['form']}
            {...this.props}
            hideActionManager={this.hideActionManager}
            context={this.state.context}
            resourceInfo={this.state.pageParams.resourceInfo}
            onActionClick={this.onActionClick}
            onClosing={this.onCloseClick}
            page={this}
            actionManager={this.createActionManager()}>
            {renderContent}
          </BBaseForm>
        );
      }
      else {
        return <BLoading context={this.state.context} />;
      }
    }
  };
}
