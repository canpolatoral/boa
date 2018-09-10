import findIndex from 'lodash/findIndex';

import { BSendApproveDialog } from 'b-send-approve-dialog';
import { BComponent, BComponentComposer } from 'b-component';
import { ActionManagerBase } from 'b-action-manager';
import { BRouteHistory } from 'b-bpm-route-history';
import { BUserNote } from 'b-bpm-user-note';
import { BPMActionReasonList } from 'b-bpm-action-reason-list';
@BComponentComposer
export class BpmActionManager extends ActionManagerBase {
  activeAction = {};
  actionExecutedSuccessfully;
  bpmActionList = [];
  standartActionList = [];
  allactionList = [];

  constructor(props, context) {
    super(props, context);
    this.isShowBpmDescriptionInput = true;
  }

  /**
   * çizilecek aksiyonları belirler
   */
  getActionList() {
    // aksiyonlar oluşturulmuş ise tekrar oluşturulmayacak.

    var resourceActionList = this.state.resourceActionList;

    if (this.allactionList && this.allactionList.length > 0) {
      this.sortActionList(this.allactionList);

      this.allactionList.forEach((item) => {
        var action = resourceActionList.find(s=>s.actionId == item.actionId);
        if (action) {
          item.isVirtual = action.isVirtual;
        }
      });
      return this.allactionList;
    }


    const { resourceInfo } = this.props.page ? this.props.page.state.pageParams : this.props;
    const { page } = this.props;

    /* ResourceOpenState
            Starting = 0,
            Started = 1,
            Explore = 2,
            ReStarting = 3
    */
    this.actionExecutedSuccessfully = false;
    this.bpmActionList = [];
    this.standartActionList = [];
    this.allactionList = [];
    let actionList = [];
    var openState = 0;
    if (page && page.state.pageParams.data && this.props.page.state.pageParams.data.openState) {
      openState = this.props.page.state.pageParams.data.openState;
    }
    var readyOnly = false;
    if (page && page.state.pageParams.data && this.props.page.state.pageParams.data.readyOnly) {
      readyOnly = this.props.page.state.pageParams.data.readyOnly;
    }

    if (page && page.state.pageParams.data) {
      let forceUpdate = true;
      if (page.getWindowRequest() === page.state.pageParams.data.windowRequest) {
        forceUpdate = false;
      }
      page.setWindowRequest(page.state.pageParams.data.windowRequest);
      page.readyOnly = readyOnly;

      if (this.props.page.onWindowRequestFilled) {
        this.props.page.onWindowRequestFilled(page.state.pageParams.data.windowRequest);
      }

      if (forceUpdate == true) {
        page.forceUpdate();
      }
    }

    if (resourceInfo) {
      let bpmBuildActionList = [];
      if (resourceInfo.workflowData && resourceInfo.workflowData.flowVersionData) {
        var versionList = Object.keys(resourceInfo.workflowData.flowVersionData).map(function (k) { return resourceInfo.workflowData.flowVersionData[k]; });
        for (let i = 0; i < versionList.length; i++) {
          let version = versionList[i];
          var stateList = Object.keys(version.stateActionList).map(function (k) { return version.stateActionList[k]; });
          for (let j = 0; j < stateList.length; j++) {
            let state = stateList[j];
            for (let k = 0; k < state.length; k++) {
              let action = state[k].resourceAction;
              let findIndexx = findIndex(bpmBuildActionList, function (x) { return x.actionId == action.actionId; });
              if (findIndexx == -1)
                bpmBuildActionList.push(action);
            }
          }
        }
      }

      if (openState == 0 || openState == 3) {
        // akış başlatabilen aksiyonlar
        if (resourceInfo.workflowData.startStateActions) {
          for (let i = 0; i < resourceInfo.workflowData.startStateActions.length; i++) {
            if (resourceInfo.workflowData.startStateActions[i].resourceAction.isVirtual == false) {
              let action = resourceInfo.workflowData.startStateActions[i].resourceAction;
              action.hasWorkflow = true;
              this.bpmActionList.push(action);
            }
          }
          // normal aksiyonlar da ekleniyor. Divit gibi.
          for (let i = 0; i < resourceActionList.length; i++) {
            let action = resourceActionList[i];
            let findIndexx = findIndex(bpmBuildActionList, function (x) { return x.actionId == action.actionId; });
            if (findIndexx > -1)
              continue;
            if (action.isVirtual)
              continue;
            if (action.actionType == 2)
              continue;
            if (resourceInfo.isRevokable &&
              (action.commandName == 'Cancel' || action.commandName == 'CancelPast' || action.commandName == 'Delete' || action.commandName == 'DeletePast'))
              continue;
            action.hasWorkflow = false;
            this.standartActionList.push(action);
          }
        }
        else {
          // eslint-disable-next-line no-console
          console.log('It could not get introduce states actions');// Giriş durumu aksiyonları alınamadı.
        }
      }
      else if (openState == 1) {  // başlamış akışlar için bu durumdan çıkan aksiyonlar
        if (resourceInfo.workflowData && resourceInfo.workflowData.flowVersionData) {
          let versionId = page.state.pageParams.data.workflowActiveVersionId;
          let activeStateId = page.state.pageParams.data.workflowActiveStateId;
          this.standartActionList = this.standartActionList.concat(this.getDefaultActionList());
          if (resourceInfo.workflowData.flowVersionData[versionId].stateActionList[activeStateId]) {
            let stateActionList = resourceInfo.workflowData.flowVersionData[versionId].stateActionList[activeStateId];
            for (let i = 0; i < stateActionList.length; i++) {
              let action = stateActionList[i].resourceAction;
              action.hasWorkflow = true;
              this.bpmActionList.push(action);
            }

            // onay modunda sayfadan gösterilmesi istenen aksiyonlar ekleniyor.
            var extraAction = this.props.page.getExtraBpmActionList();
            if (extraAction) {
              if (extraAction.length > 0) {
                for (let i = 0; i < extraAction.length; i++) {

                  let findIndexAction = findIndex(resourceActionList, function (x) { return x.commandName == extraAction[i]; });
                  if (findIndexAction > -1) {
                    let action = resourceActionList[findIndexAction];
                    let findIndexx = findIndex(this.standartActionList, function (x) { return x.actionId == action.actionId; });
                    if (findIndexx == -1) {
                      action.hasWorkflow = false;
                      this.standartActionList.push(action);
                    }
                  }
                }
              }
            }
          }
        }
        else {
          // eslint-disable-next-line no-console
          console.log('There are some error occur  while getting actions and states'); // Aktif durum ve aksiyon bilgileri alınamadı.
        }
      }

      else if (openState == 2) { // explore: sadece izleme
        // TODO: kod tarafından özellikle görünmesi istenen aksiyonlar da eklenecek...
        this.bpmActionList = [];
        this.standartActionList = this.getDefaultActionList();
      }
      actionList = this.bpmActionList.concat(this.standartActionList);
      this.allactionList = actionList;
      var tmpActionList = [];
      actionList.forEach((element) => {
        let findIndexx = findIndex(tmpActionList, function (x) { return x.actionId == element.actionId; });
        if (findIndexx == -1) {
          let findIndexState = findIndex(resourceActionList, function (x) { return x.actionId == element.actionId; });
          if (findIndexState == -1)
            tmpActionList.push(element);
          else if (resourceActionList[findIndexState].isVirtual == false) {
            tmpActionList.push(element);
          }
        }
      }, this);

      actionList = tmpActionList;

      if (this.props.filterCommandNameList) {
        actionList = actionList.filter((action) => this.props.filterCommandNameList.includes(action.commandName));
      }
      if (this.props.hideCommandNameList) {
        actionList = actionList.filter((action) => !this.props.hideCommandNameList.includes(action.commandName));
      }
      // sıralama
      this.sortActionList(actionList);


      return actionList;
    }
    else {
      // eslint-disable-next-line no-console
      console.log('ResourceInfo alınamadı.');
    }
  }

  /**
   * işlemler menüsü altında bulunan varsayılan işlem butonlarıdır. yol haritası, notlar vb..
   */
  getDefaultActionList() {
    return {
      'resourceId': 156,
      'name': this.getMessage('BusinessComponents', 'Transactions'),
      'description': this.getMessage('BusinessComponents', 'Transactions'),
      'items': [
        {
          'resourceId': 156,
          'actionId': 19,
          'actionType': 1,
          'name': this.getMessage('BusinessComponents', 'WorkFlowRouteMap'),
          'commandName': 'ShowRouteHistory',
          'groupName': this.getMessage('BusinessComponents', 'Transactions'),
          'description': this.getMessage('BusinessComponents', 'WorkFlowRouteMap'),
          'iconPath': 'Map',
          'isVirtual': false,
          'isAssignable': true,
          'hasAccounting': false,
          'hasSlip': false,
          'hasCommission': false,
          'hasWorkflow': false,
          'sortId': 9,
          'systemDate': '0001-01-01T00:00:00',
          'hasAuthorization': false,
          'hasTellerTransaction': false,
          'hasRevokableTransaction': false,
          'hasFutureDated': false,
          'isSelected': false,
          'isSelectable': true,
          'disabled': false
        },
        {
          'resourceId': 156,
          'actionId': 30,
          'actionType': 2,
          'name': this.getMessage('BusinessComponents', 'WorkFlowNotes'),
          'commandName': 'UserNote',
          'groupName': this.getMessage('BusinessComponents', 'Transactions'),
          'description': this.getMessage('BusinessComponents', 'WorkFlowNotes'),
          'iconPath': 'Chat',
          'isVirtual': false,
          'isAssignable': true,
          'hasAccounting': false,
          'hasSlip': false,
          'hasCommission': false,
          'hasWorkflow': false,
          'sortId': 10,
          'systemDate': '0001-01-01T00:00:00',
          'hasAuthorization': false,
          'hasTellerTransaction': false,
          'hasRevokableTransaction': false,
          'hasFutureDated': false,
          'isSelected': false,
          'isSelectable': true,
          'disabled': false
        },
        {
          'resourceId': 156,
          'actionId': 11,
          'actionType': 2,
          'name': this.getMessage('BusinessComponents', 'ActionReason'),
          'commandName': 'ActionReason',
          'groupName': this.getMessage('BusinessComponents', 'Transactions'),
          'description': this.getMessage('BusinessComponents', 'ActionReason'),
          'iconPath': 'List',
          'isVirtual': false,
          'isAssignable': true,
          'hasAccounting': false,
          'hasSlip': false,
          'hasCommission': false,
          'hasWorkflow': false,
          'sortId': 10,
          'systemDate': '0001-01-01T00:00:00',
          'hasAuthorization': false,
          'hasTellerTransaction': false,
          'hasRevokableTransaction': false,
          'hasFutureDated': false,
          'isSelected': false,
          'isSelectable': true,
          'disabled': false
        },
      ],
      'sortId': 99,
      'actionId': -1,
      'isVirtual': false
    };
  }

  /**
   * bir aksiyona tıklandığında iş akışı için doldurulması gereken alanları doldurur ve işlemleri başlatır.
   * @param {*} action
   * @param {*} request
   */
  setWorkflowInternalProperties(action, request) {
    const { resourceInfo } = this.props.page ? this.props.page.state.pageParams : this.props;
    if (!request) {
      request = { methodName: 'Call' };
    }
    if (!request.workFlowInternalData) {
      request.workFlowInternalData = {};
    }
    if (!request.workFlowData) {
      request.workFlowData = {};
    }

    var openState = 0;
    if (this.props.page && this.props.page.state.pageParams.data && this.props.page.state.pageParams.data.openState) {
      openState = this.props.page.state.pageParams.data.openState;
    }

    // akış ilk bilgiler dolduruluyor.
    request.hasWorkflow = true; // TODO: bu gidebilir.
    request.resourceCode = resourceInfo.resourceCode;
    request.actionId = action.actionId;
    request.resourceId = action.resourceId;

    // serialize edilip saklanan request içeriisnde eski token verisi saklandığı için burada tekrar boşaltılması gerekti.
    request.externalAuthorizationToken  =null;

    request.workFlowInternalData.promoteOutSideUserName = null; // ekrandan yapılan işlemlerde bu doldurulamaz...
    request.workFlowInternalData.userDescription = this.getBpmDescription();
    request.workFlowInternalData.workFlowUrgency = request.workFlowInternalData.workFlowUrgency; // TODO: ekrandan alınabilecek.
    request.workFlowInternalData.transactionWorkGroupId = this.props.context.applicationContext.user.workGroupId;
    if (openState == 0 || openState == 3) {
      request.workFlowInternalData.firstActionId = action.actionId;
      request.workFlowInternalData.lastChanceApproved = false; // bunu karıştırma.
    }
    else if (openState == 1) { // onay
      // TODO : durum gerekçeleri gerekli mi ?
      if (request.workFlowInternalData.saveStates != null && request.workFlowInternalData.saveStates.length > 0) {
        request.workFlowInternalData.saveStates.forEach((item) => {
          item.isSelected = true;
        });
      }
    }
  }

  /**
   * action clik
   * @param {*} e
   */
  genericActionClick(e) {
    this.activeAction = e;
    if (this.activeAction.actionId == -1)
      return;
    if (this.isDefaultAction(e)) {  // işlemler menüsüne ait aksiyonlar
      this.defaultActionClick(e);
      return;
    }
    if (this.activeAction.hasWorkflow == false) { // standart action
      super.genericActionClick(e);
      return;
    }
    var isCompleted = super.genericActionClick(e, this.executeWorkflow.bind(this));
    if (isCompleted == false) { // sadece false gönderdiği durumda manuel işlem yapması sağlanacak.
      // eslint-disable-next-line no-console
      console.log('false:Workflow will run manually.');
    }
    else {
      // eslint-disable-next-line no-console
      console.log('Workflow will run automatically');
      this.executeWorkflow();
    }
  }

  /**
   * işlemler aksiyon grubununda olup olmadığı bilgisi
   * @param {*} action
   */
  isDefaultAction(action) {
    let findIndexx = findIndex(this.getDefaultActionList().items, function (x) { return x.commandName == action.commandName; });
    if (findIndexx == -1)
      return false;
    else
      return true;
  }

  /**
   * İşlemler menüsü altındaki aksiyonları çalıştırır
   * @param {*} action
   */
  defaultActionClick(action) {
    var instanceId = 0;
    if (this.props.page.getWindowRequest() && this.props.page.getWindowRequest().body.workFlowInternalData.instanceId)
      instanceId = this.props.page.getWindowRequest().body.workFlowInternalData.instanceId;
    switch (action.commandName) {
      case 'ShowRouteHistory':
        {
          BRouteHistory.showRoute(this.props.context, instanceId);
          break;
        }
      case 'UserNote':
        {
          BUserNote.showNote(this.props.context, instanceId);
          break;
        }
      case 'ActionReason':
        {
          BPMActionReasonList.showActionReasonList(this.props.context, instanceId);
          break;
        }
    }
  }


  /**
   * ilgili form üzerindeki progressleri yönetir
   * @param {*} isloading
   */
  setLoading(isloading) {
    if (this.props.page && this.props.page.form) {
      if (isloading) {
        this.props.page.form.showProgress();
      }
      else {
        this.props.page.form.hideProgress();
      }
    }
  }

  /**
   * workflow executer
   */
  executeWorkflow() {
    this.state.resourceInfo  = this.props.page ? this.props.page.state.pageParams.resourceInfo : this.props.resourceInfo;
    // eslint-disable-next-line no-console
    console.log('it called from executeWorkflow');
    this.state.action = this.activeAction;
    // let model, request, type;

    if (this.props.page) {
      this.state.model = this.props.page.getWindowRequest(); // kullanıcı tarafından doldurulan request
      this.state.request =this.state.model.body;
      this.state.type = this.state.model.type;
    }

    this.state.openState = 0;
    if (this.props.page && this.props.page.state.pageParams.data && this.props.page.state.pageParams.data.openState) {
      this.state.openState = this.props.page.state.pageParams.data.openState;
    }

    if (this.state.model) {
      this.setWorkflowInternalProperties(this.state.action, this.state.request);
      this.state.request.fromTransactionalExecute = true; // her zaman transactional olmalı
      let proxyRequest = {
        requestClass: this.state.type,
        requestBody: this.state.request,
        key: 'SIMULATE'
      };
      this.proxyTransactionExecute(proxyRequest);
    }
  }

  proxyDidRespond(proxyResponse) {

    let {  key } = proxyResponse;
    const result: any = proxyResponse.response;
    // eslint-disable-next-line no-console
    console.log('first call');
    switch (key) {

      case 'SIMULATE':
        {
          if (result.success == true) {
            this.actionExecutedSuccessfully = true;
            let lastChanceEnabled = false;
            if (this.state.openState == 0 || this.state.openState == 3) {
              lastChanceEnabled = result.isSimulated;
            }
            if (lastChanceEnabled) { // simülasyon yapılmışsa engine tekrar girecek..
              BSendApproveDialog.showApproveDialog(
                this.props.context, result.sendStateList, result.flowName, this.state.resourceInfo.id,
                this.state.request.workFlowData.ownerWorkGroupId,
                this.state.request.workFlowInternalData.transactionWorkGroupId,
                ((dialogResponse) => {
                  if (dialogResponse == BComponent.DialogResponse.YES) {
                    // akış ilk bilgiler dolduruluyor.
                    this.actionExecutedSuccessfully = false;
                    this.setWorkflowInternalProperties(this.state.action, this.state.request);
                    this.state.request.workFlowInternalData.lastChanceApproved = true;
                    this.state.request.fromTransactionalExecute = true; // her zaman transactional olmalı
                    let proxyRequest = {
                      requestClass: this.state.type,
                      requestBody: this.state.request,
                      key: 'EXECUTE'
                    };
                    this.proxyTransactionExecute(proxyRequest);
                  }
                  else {
                    // TODO : boa da iptal edildiğinde bir event fırlatılıyor, ihtiyaç ise buraya eklenebilir.
                    // eslint-disable-next-line no-console
                    console.log('Process cancelled');
                  }
                }).bind(this));
            }
            else { // simülasyon yok.
              this.showMessage(this.generateMessage(result));
              if (this.props.page.onActionClickAfter) {
                this.props.page.onActionClickAfter(this.activeAction, result);
              }
              if (this.state.openState == 1) {  // onay iin açılmışsa onaydan sonra kapatılıyor.
                this.props.page.onPageCloseClick();
              }
            }
          }

          else { // simülasyon yok.
            if (this.props.page.onActionClickAfter) {
              this.props.page.onActionClickAfter(this.activeAction, result);
            }

          }
          break;
        }
      case 'EXECUTE':
        {
          // eslint-disable-next-line no-console
          console.log('Call that after simulation');
          if (result.success == true) {
            this.actionExecutedSuccessfully = true;
            this.showMessage(this.generateMessage(result));
            // this.props.page.onPageCloseClick();
          }
          else {
            // eslint-disable-next-line no-console
            console.log(result);
          }
          if (this.props.page.onActionClickAfter) {
            this.props.page.onActionClickAfter(this.activeAction, result);
          }
          break;
        }
    }

  }

  /**
   * uyarı mesajlarını oluşturur
   * @param {*} responseWorkflow
   */
  generateMessage(responseWorkflow) {
    let message;
    if (responseWorkflow.isCompleted) {
      if (responseWorkflow.workflowResult == 1) { // WorkflowResult.Return
        message = this.getMessage('Workflow', 'WorkflowReturn').replace('{0}', responseWorkflow.flowName); // responseWorkflow.flowName + ' işlemi reddedildi. İşlem gerçekleştirilmedi.';  // "Workflow", "WorkflowReturn"
      }
      else if (responseWorkflow.workflowResult == 2) { // WorkflowResult.ExecuteMainProcess
        message = this.getMessage('Workflow', 'WorkflowExecuteMainProcess').replace('{0}', responseWorkflow.flowName); // responseWorkflow.flowName + ' işlemi başarılı şekilde gerçekleştirildi.';   // "Workflow", "WorkflowExecuteMainProcess"
      }
    }
    else {
      message = this.getMessage('Workflow', 'WorkflowSendToPool'); // 'İşleminiz onaya gönderildi.';   // "Workflow", "WorkflowSendToPool"
    }
    return message;
  }

}

export default BpmActionManager;
