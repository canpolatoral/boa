import * as React from 'react';
import PropTypes from 'prop-types';
import { getMessage } from 'b-framework';
import { BDialogHelper } from 'b-dialog-box';
import BComboBox from 'b-combo-box';
import BRadioButton from 'b-radio-button';
import BInput from 'b-input';
import BCard from 'b-card';
import BButton from 'b-button';
import BIconButton from 'b-icon-button';
import BActionButton from 'b-action-button';
import BDivider from 'b-divider';
import BLabel from 'b-label';
import { DialogResponse } from 'b-component';
import { BRegistryIntellisenseEditor } from 'b-registry-intellisense-editor';
import { BBusinessComponent } from 'b-business-component';
import { BTransactionForm } from 'b-transaction-form';

export class BDynamicActionEdit extends BBusinessComponent {
  static propTypes = {
    designerType: PropTypes.string,
    model: PropTypes.any
  };

  static defaultProps = {
    resourceCode: 'YONTDYNOZL',
    designerType: 'transaction',
    model: null
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      model: this.props.model || { actions: [], componentValues: [] },
      formActionList: [],
      selectedCP: [],
      actionCatalogList: [],
      storedProcedureList: [],
      resourceList: [],
      requestList: [],
      ruleList: [],
      dataSourceList: []
    };

    this.onChangeRadio = this.onChangeRadio.bind(this);
    this.onAddNewActionClick = this.onAddNewActionClick.bind(this);
  }

  formActionList: any;
  formId: number;

  getValues() {
    return this.state.formActionList;
  }

  proxyDidRespond(proxyResponse) {
    const { key } = proxyResponse;
    const response: any = proxyResponse.response;
    switch (key) {
      case 'GetAllCustomizationData':
        if (response.success) {
          this.setState({
            actionCatalogList: response.value.actionCatalogList,
            storedProcedureList: response.value.storedProcedureList,
            resourceList: response.value.resourceList,
            requestList: response.value.requestList,
            ruleList: response.value.ruleList
          });
        } else {
          BDialogHelper.show(this.state.context, getMessage('BusinessComponents', 'ProcessCouldNotBePerformed'));
          console.log(response.results);
        }
        break;
      case 'GetSpReturnColumns':
        if (response.success) {
          let selectedAction = Object.assign(this.state.selectedAction, {
            spReturnColumns: response.value
          });
          let actions: any[] = this.state.formActionList;
          var index = actions.findIndex(x => x.actionId == selectedAction.actionId);
          actions[index] = selectedAction;
          this.setState({
            selectedAction: selectedAction,
            formActionList: Object.assign([], actions),
            spReturnColumnList: response.value
          });
        } else {
          BDialogHelper.show(this.state.context, getMessage('BusinessComponents', 'ProcessCouldNotBePerformed'));
          console.log(response.results);
        }
        break;
    }
  }

  onActionClick() {
    BDialogHelper.close(this, DialogResponse.YES, this.state.formActionList);
  }

  getIntellisenseEditor(snapKey, label, value) {
    let dataSource =
      this.state.dataSourceList &&
      this.state.dataSourceList.map((s) => {
        return {
          text: s,
          value: s
        };
      });

    return (
      <BRegistryIntellisenseEditor
        ref={(r) => (this[snapKey] = r)}
        context={this.props.context}
        isProcessSourceVisible={false}
        isRegistrySourceVisible={false}
        dataSource={dataSource}
        propertySearchText={value}
        hintText={label}
        propertySearchTextChanged={this.onComponentPropertyForSpSelectManuel.bind(this, snapKey)}
      />
    );
  }

  onChangeRadio(e) {
    var actionId = Number(e.target.value);
    this.onSelectActionById(actionId);
  }

  onActionButtonClick(action) {
    this.onSelectActionById(action.actionId);
  }

  onSelectActionById(actionId) {
    let actions: any[] = this.state.formActionList;
    actions.forEach(formAction => {
      formAction.isSelected = 0;
    });

    var actionData = actions.find(x => x.actionId == actionId);
    actionData.isSelected = 1;

    if (!actionData.dataSourceType) {
      actionData.dataSourceType = 1;
    }

    if (!actionData.actionVisibilityType) {
      actionData.actionVisibilityType = 1;
    }

    let dataSourceList: string[] = [];
    if (actionData.dataSourceType == 1) {
      dataSourceList = this.getComponentPropertyList();
    } else if (actionData.dataSourceType == 2) {
      dataSourceList = this.getBrowseFormColumns();
    }

    this.setState({
      selectedAction: actionData,
      formActionList: Object.assign([], actions),
      dataSourceList: dataSourceList
    });
  }

  onAddNewActionClick() {
    let actions: any[] = this.state.formActionList;
    var actionId = 0;
    for (var i = 1; i < 64; i++) {
      var index = actions.findIndex(x => x.actionId == i);
      if (index == -1) {
        actionId = i;
        break;
      }
    }

    var formAction = this.getInitializedAction(actionId);

    actions.push(formAction);
    this.setState({ formActionList: Object.assign([], actions) });
  }

  onDeleteActionClick(action: any) {
    let actions: any[] = this.state.formActionList;
    var index = actions.findIndex(x => x.actionId == action.actionId);
    actions.splice(index, 1);

    var selectedAction = this.state.selectedAction;
    if (selectedAction) {
      index = actions.findIndex(x => x.actionId == selectedAction.actionId);
      if (index == -1) {
        selectedAction = null;
      }
    }
    this.setState({ selectedAction: selectedAction, formActionList: Object.assign([], actions) });
  }

  setCatalogActionId(action: any) {
    let actionCatalogList: any[] = this.state.actionCatalogList;
    var indexCatalog = actionCatalogList.findIndex(x => x.actionId == action.actionId);
    if (indexCatalog != -1 && action.actionId !== undefined) {
      let cat = actionCatalogList[indexCatalog];
      action.actionId = cat.actionId;
    } else {
      var actionId = 0;
      for (var i = 1; i < 64; i++) {
        if (actionCatalogList.findIndex(x => x.actionId == i) == -1 && this.state.formActionList.findIndex(x => x.actionId == i)) {
          actionId = i;
          break;
        }
      }
      action.actionId = actionId;
    }
  }

  setSelectedAction(action: any) {
    let actions: any[] = this.state.formActionList;
    var index = actions.findIndex(x => x.actionId == action.actionId);
    this.setCatalogActionId(action);
    actions[index] = action;
    this.setState({ selectedAction: action, formActionList: Object.assign([], actions) });
  }

  onComponentPropertyForSpSelectManuel(parameterNameFull: any) {
    var propertyName = parameterNameFull.split('_')[0];
    var key = parameterNameFull.split('_')[1];
    var value = parameterNameFull.split('_')[2];
    var parameterName = parameterNameFull.split('_')[3];

    let parameters: any[] = this.state.selectedAction[propertyName];
    var pIndex = parameters.findIndex(x => x[key] == parameterName);

    var component = this[parameterNameFull];
    var componentValue = component && component.getInstance().getValue() ? component.getInstance().getValue().propertySearchText : '';

    parameters[pIndex][value] = componentValue;

    let selectedAction = Object.assign({}, this.state.selectedAction);
    selectedAction[propertyName] = parameters;
    this.setSelectedAction(selectedAction);
  }

  onColumnDisplayNameChange(columnName: any, e: any) {
    let spReturnColumns: any[] = this.state.selectedAction.spReturnColumns;
    var pIndex = spReturnColumns.findIndex(x => x.columnName == columnName);

    spReturnColumns[pIndex].displayName = e.target.value;

    let selectedAction = Object.assign(this.state.selectedAction, {
      spReturnColumns: spReturnColumns
    });
    this.setSelectedAction(selectedAction);
  }

  onCustomizationDataSelect(changedKey: string, selectedIndexes: number[], selectedItems: any[], selectedValues: any[]) {
    if (selectedItems.length > 0) {
      var changedComboName = changedKey.split('#')[0];
      var changedParameterName = changedKey.indexOf('#') > -1 ? changedKey.split('#')[1] : '';

      switch (changedComboName) {
        case 'Rule':
          if (this.isValueChanged(this.state.selectedAction.ruleCode, selectedValues[0])) {
            let selectedAction = Object.assign(this.state.selectedAction, {
              ruleCode: selectedValues[0],
              ruleParameters: []
            });
            selectedItems[0].ruleParameters.map((parameter: any) => {
              selectedAction.ruleParameters.push({ parameterName: parameter.parameterName, parameterValue: '' });
            });
            this.setSelectedAction(selectedAction);
          }
          break;
        case 'ActionCatalog':
          if (this.isValueChanged(this.state.selectedAction.actionCatalogId, selectedValues[0])) {
            let selectedAction = Object.assign(this.state.selectedAction, {
              iconPath: selectedItems[0].iconPath,
              name: selectedItems[0].actionName,
              actionCatalogId: selectedValues[0],
              actionId: selectedItems[0].actionId
            });

            this.setSelectedAction(selectedAction);
          }
          break;
        case 'ActionType':
          if (this.isValueChanged(this.state.selectedAction.actionTypeId, selectedValues[0])) {
            let selectedAction = Object.assign(this.state.selectedAction, {
              actionTypeId: selectedValues[0],
              spId: 0,
              spName: '',
              spParameters: []
              // TODO: tüm alanlar eklenmeli
            });
            this.setSelectedAction(selectedAction);
          }
          break;
        case 'StoredProcedure':
          if (this.isValueChanged(this.state.selectedAction.spId, selectedValues[0])) {
            let selectedAction = Object.assign(this.state.selectedAction, {
              spId: selectedValues[0],
              spName: selectedItems[0].spName,
              spParameters: [],
              spReturnColumns: []
            });

            selectedItems[0].spParameters.map((parameter: any) => {
              selectedAction.spParameters.push({ parameterName: parameter.parameterName, parameterValue: '' });
            });

            var spValues = selectedAction.spName.split('.');
            if (spValues[2].startsWith('sel_')) {
              let proxyRequest = {
                requestClass: 'BOA.Types.DynamicFormGenerator.SpBrowserRequest',
                requestBody: {
                  methodName: 'SelectSpReturnColumnsForBoaOne',
                  resourceCode: 'YONTDYNOZL',
                  dataContract: {
                    databaseName: spValues[0],
                    schemaName: spValues[1],
                    spName: spValues[2]
                  }
                },
                key: 'GetSpReturnColumns'
              };
              this.proxyExecute(proxyRequest);
            }

            this.setSelectedAction(selectedAction);
          }
          break;
        case 'Resource':
          if (this.isValueChanged(this.state.selectedAction.resourceCode, selectedValues[0])) {
            let selectedAction = Object.assign(this.state.selectedAction, {
              resourceCode: selectedValues[0],
              resourceName: selectedItems[0].resourceName,
              resourceComponentProperty: []
            });
            selectedItems[0].resourceComponentProperty.map((componentProperty: any) => {
              selectedAction.resourceComponentProperty.push({
                targetComponentProperty: componentProperty.targetComponentProperty,
                sourceComponentProperty: ''
              });
            });
            this.setSelectedAction(selectedAction);
          }
          break;
        case 'Request':
          if (this.isValueChanged(this.state.selectedAction.requestId, selectedValues[0])) {
            let selectedAction = Object.assign(this.state.selectedAction, {
              requestId: selectedValues[0],
              requestName: selectedItems[0].requestName,
              requestMethodName: '',
              requestFields: [],
              requestMethods: []
            });
            selectedItems[0].requestFields.map((field: any) => {
              selectedAction.requestFields.push({ fieldName: field.fieldName, fieldValue: '' });
            });
            selectedItems[0].requestMethods.map((method: any) => {
              selectedAction.requestMethods.push({ methodName: method.methodName });
            });
            this.setSelectedAction(selectedAction);
          }
          break;
        case 'RequestMethod':
          if (this.isValueChanged(this.state.selectedAction.requestMethodName, selectedValues[0])) {
            let selectedAction = Object.assign(this.state.selectedAction, {
              requestMethodName: selectedValues[0]
            });
            this.setSelectedAction(selectedAction);
          }
          break;
        case 'DataSourceType':
          if (this.isValueChanged(this.state.selectedAction.dataSourceType, selectedValues[0])) {
            let selectedAction = Object.assign(this.state.selectedAction, {
              dataSourceType: selectedValues[0]
            });

            let dataSourceList: any[] = [];
            if (selectedAction.dataSourceType == 1) {
              dataSourceList = this.getComponentPropertyList();
            } else if (selectedAction.dataSourceType[0] == 2) {
              dataSourceList = this.getBrowseFormColumns();
            }

            let actions: any[] = this.state.formActionList;
            var index = actions.findIndex(x => x.actionId == selectedAction.actionId);
            actions[index] = selectedAction;
            this.setState({
              selectedAction: selectedAction,
              formActionList: Object.assign([], actions),
              dataSourceList: dataSourceList
            });
          }
          break;
        case 'ActionVisibilityType':
          if (this.isValueChanged(this.state.selectedAction.actionVisibilityType, selectedValues[0])) {
            let selectedAction = Object.assign(this.state.selectedAction, {
              actionVisibilityType: selectedValues[0]
            });
            this.setSelectedAction(selectedAction);
          }
          break;
        case 'ComponentPropertyForResource':
          let resourceComponentProperty: any[] = this.state.selectedAction.resourceComponentProperty;
          var pIndex = resourceComponentProperty.findIndex(x => x.targetComponentProperty == changedParameterName);
          if (this.isValueChanged(resourceComponentProperty[pIndex].sourceComponentProperty, selectedValues[0])) {
            resourceComponentProperty[pIndex].sourceComponentProperty = selectedValues[0];

            let selectedAction = Object.assign(this.state.selectedAction, {
              resourceComponentProperty: resourceComponentProperty
            });
            this.setSelectedAction(selectedAction);
          }
          break;
        case 'ComponentPropertyForRequest':
          let requestFields: any[] = this.state.selectedAction.requestFields;
          if (this.isValueChanged(requestFields[pIndex].fieldValue, selectedValues[0])) {
            requestFields[pIndex].fieldValue = selectedValues[0];

            let selectedAction = Object.assign(this.state.selectedAction, {
              resourceComponentProperty: resourceComponentProperty
            });
            this.setSelectedAction(selectedAction);
          }
          break;
      }
    }
  }

  isValueChanged(oldValue: any, newValue: any) {
    if ((oldValue && oldValue.length == 0) || oldValue != newValue) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    super.componentDidMount();

    let proxyRequest = {
      requestClass: 'BOA.Types.DynamicFormGenerator.DynamicFormCustomizationRequest',
      requestBody: {
        methodName: 'SelectAllCustomizationData',
        resourceCode: 'YONTDYNOZL'
      },
      key: 'GetAllCustomizationData'
    };
    this.proxyTransactionExecute(proxyRequest);

    if (this.state.model) {
      var formActionList: any[] = this.state.formActionList;
      if (!formActionList || formActionList.length == 0) {
        this.setState({ formActionList: this.state.model.actions });
      }
    }
  }

  getComponentPropertyList() {
    var componentPropertyList: any[] = [];
    this.state.model.componentValues.forEach((componentValue: string) => {
      componentPropertyList.push('m.' + componentValue);
    });
    return componentPropertyList;
  }

  getBrowseFormColumns() {
    var browseFormColumns: any[] = [];

    let actions: any[] = this.state.formActionList;
    var getInfoAction = actions.find(x => x.spName.indexOf('.sel_') > -1);

    let columns: any[] = getInfoAction.spReturnColumns;
    columns.forEach(column => {
      browseFormColumns.push('m.' + column.columnName);
    });

    return browseFormColumns;
  }

  getInitializedAction(actionId: number) {
    var formAction: any = {
      actionId: actionId,
      name: 'Select',
      iconPath: 'ContentBlock',
      isSelected: 0,
      actionCatalogId: 0,
      actionTypeId: 0,
      spId: 0,
      spName: '',
      spParameters: [],
      spReturnColumns: [],
      resourceCode: '',
      resourceName: '',
      resourceComponentProperty: [],
      requestId: 0,
      requestName: '',
      requestFields: [],
      requestMethodName: '',
      requestMethods: [],
      dataSourceType: 1,
      actionVisibilityType: 1,
      ruleCode: '',
      ruleParameters: []
    };
    return formAction;
  }

  render() {
    let { context } = this.props;

    let actionTypes = [
      { key: 0, value: getMessage('BusinessComponents', 'Select') },
      { key: 1, value: getMessage('DynamicFormGenerator', 'Process') },
      { key: 2, value: getMessage('DynamicFormGenerator', 'OpenForm') },
      { key: 3, value: getMessage('DynamicFormGenerator', 'MakeRequest') },
      { key: 4, value: getMessage('DynamicFormGenerator', 'OpenDivit') },
      { key: 5, value: getMessage('BOA', 'CloseWindow') }
    ];

    let dataSourceTypes = [
      { key: 1, value: getMessage('DynamicFormGenerator', 'ComponentLabel') },
      { key: 2, value: getMessage('DynamicFormGenerator', 'Columns') }
    ];

    let actionVisibilityType = [
      { key: 1, value: getMessage('BusinessComponents', 'Select') },
      { key: 2, value: getMessage('DynamicFormGenerator', 'VisibleInNewRecord') },
      { key: 3, value: getMessage('DynamicFormGenerator', 'VisibleInUpdateRecord') }
    ];
 
    var divider = <BDivider context={context} style={{ marginTop: 24, marginLeft: -24, marginRight: -24, marginBottom: 24 }} />;
    var labelStyle = { fontSize: 24 };

    if (this.state.selectedAction) {
      if (this.props.designerType == 'browse') {
        var dataSourceCombo = (
          <BComboBox
            context={context}
            ref={r => (this.dataSourceType = r)}
            dataSource={dataSourceTypes}
            multiSelect={false}
            multiColumn={false}
            onSelect={this.onCustomizationDataSelect.bind(this, 'DataSourceType')}
            value={[this.state.selectedAction.dataSourceType]}
            displayMemberPath="value"
            valueMemberPath="key"
            labelText={getMessage('DynamicFormGenerator', 'DataSource')}
          />
        );
      }

      if (this.props.designerType == 'transaction') {
        var actionVisibilityTypeCombo = (
          <BComboBox
            ref={r => (this.actionVisibility = r)}
            context={context}
            dataSource={actionVisibilityType}
            multiSelect={false}
            multiColumn={false}
            onSelect={this.onCustomizationDataSelect.bind(this, 'ActionVisibilityType')}
            value={[this.state.selectedAction.actionVisibilityType]}
            displayMemberPath="value"
            valueMemberPath="key"
            labelText={getMessage('DynamicFormGenerator', 'ActionView')}
          />
        );
      }

      if (this.state.selectedAction.ruleParameters && this.state.selectedAction.ruleParameters.length > 0) {
        var ruleParameters = this.state.selectedAction.ruleParameters.map((parameter: any) => {
          var snapKey = 'ruleParameters_parameterName_parameterValue_' + parameter.parameterName;
          return this.getIntellisenseEditor(snapKey, parameter.parameterName, parameter.parameterValue);
        });
        var ruleDivider = divider;
        var ruleParameterLabel = <BLabel context={context} text={getMessage('DynamicFormGenerator', 'ParameterList')} style={labelStyle} />;
      }

      var ruleCard = (
        <BCard column={1} context={context}>
          <BComboBox
            ref={r => (this.ruleList = r)}
            context={context}
            dataSource={this.state.ruleList}
            multiSelect={false}
            multiColumn={false}
            onSelect={this.onCustomizationDataSelect.bind(this, 'Rule')}
            value={[this.state.selectedAction.ruleCode]}
            displayMemberPath="ruleName"
            valueMemberPath="ruleCode"
            labelText={getMessage('Workflow', 'Rule')}
          />
          {ruleDivider}
          {ruleParameterLabel}
          {ruleParameters}
        </BCard>
      );

      var detailContentCard = (
        <BCard column={1} context={context}>
          <BComboBox
            ref={r => (this.actionCatalog = r)}
            context={context}
            dataSource={this.state.actionCatalogList}
            multiSelect={false}
            multiColumn={false}
            onSelect={this.onCustomizationDataSelect.bind(this, 'ActionCatalog')}
            value={[this.state.selectedAction.actionCatalogId]}
            displayMemberPath="actionName"
            valueMemberPath="actionCatalogId"
            labelText={getMessage('BusinessComponents', 'labelActions')}
          />
          <BComboBox
            ref={r => (this.actionType = r)}
            context={context}
            dataSource={actionTypes}
            multiSelect={false}
            multiColumn={false}
            onSelect={this.onCustomizationDataSelect.bind(this, 'ActionType')}
            value={[this.state.selectedAction.actionTypeId]}
            displayMemberPath="value"
            valueMemberPath="key"
            labelText={getMessage('BusinessComponents', 'TypeLabel')}
          />

          {dataSourceCombo}
          {actionVisibilityTypeCombo}
        </BCard>
      );

      var actionTypeDetailCard;

      if (this.state.selectedAction.actionTypeId == 1) {
        if (this.state.selectedAction.spParameters && this.state.selectedAction.spParameters.length > 0) {
          var spParameters = this.state.selectedAction.spParameters.map((parameter: any) => {
            var snapKey = 'spParameters_parameterName_parameterValue_' + parameter.parameterName;
            return this.getIntellisenseEditor(snapKey, parameter.parameterName, parameter.parameterValue);
          });
          var spParametersDivider = divider;
          var spParametersLabel = (
            <BLabel context={context} text={getMessage('DynamicFormGenerator', 'ParameterList')} style={labelStyle} />
          );
        }
        if (this.state.selectedAction.spReturnColumns && this.state.selectedAction.spReturnColumns.length > 0) {
          var spReturnColumns = this.state.selectedAction.spReturnColumns.map((returnColumn: any) => {
            return (
              <BInput
                name={returnColumn.columnName}
                context={context}
                type="text"
                floatingLabelText={returnColumn.columnName}
                hintText={returnColumn.columnName}
                value={returnColumn.displayName}
                onBlur={this.onColumnDisplayNameChange.bind(this, returnColumn.columnName)}
              />
            );
          });
          var spReturnColumnDivider = divider;
          var spReturnColumnLabel = (
            <BLabel context={context} text={getMessage('DynamicFormGenerator', 'ReturnValueList')} style={labelStyle} />
          );
        }
        actionTypeDetailCard = (
          <BCard context={context}>
            <BComboBox
              ref={r => (this.storedProcedure = r)}
              context={context}
              dataSource={this.state.storedProcedureList}
              multiSelect={false}
              multiColumn={false}
              onSelect={this.onCustomizationDataSelect.bind(this, 'StoredProcedure')}
              value={[this.state.selectedAction.spId]}
              displayMemberPath="spName"
              valueMemberPath="authorizedSpId"
              labelText={getMessage('Transaction', 'StoredProcedure')}
            />

            {spParametersDivider}
            {spParametersLabel}
            {spParameters}

            {spReturnColumnDivider}
            {spReturnColumnLabel}
            {spReturnColumns}
          </BCard>
        );
      } else if (this.state.selectedAction.actionTypeId == 2) {
        if (this.state.selectedAction.resourceComponentProperty && this.state.selectedAction.resourceComponentProperty.length > 0) {
          var resourceComponentProperty = this.state.selectedAction.resourceComponentProperty.map((componentProperty: any) => {
            var snapKey =
              'resourceComponentProperty_targetComponentProperty_sourceComponentProperty_' + componentProperty.targetComponentProperty;
            return this.getIntellisenseEditor(
              snapKey,
              componentProperty.targetComponentProperty,
              componentProperty.sourceComponentProperty
            );
          });
          var resourceComponentPropertyDivider = divider;
          var resourceComponentPropertyLabel = (
            <BLabel context={context} text={getMessage('DynamicFormGenerator', 'DisplayedScreenComponents')} style={labelStyle} />
          );
        }
        actionTypeDetailCard = (
          <BCard context={context}>
            <BComboBox
              context={context}
              ref={r => (this.resource = r)}
              dataSource={this.state.resourceList}
              multiSelect={false}
              multiColumn={false}
              onSelect={this.onCustomizationDataSelect.bind(this, 'Resource')}
              value={[this.state.selectedAction.resourceCode]}
              displayMemberPath="resourceName"
              valueMemberPath="resourceCode"
              labelText={getMessage('Workflow', 'WFLForm')}
            />

            {resourceComponentPropertyDivider}
            {resourceComponentPropertyLabel}
            {resourceComponentProperty}
          </BCard>
        );
      } else if (this.state.selectedAction.actionTypeId == 3) {
        if (this.state.selectedAction.requestFields && this.state.selectedAction.requestFields.length > 0) {
          var requestFields = this.state.selectedAction.requestFields.map((field: any) => {
            return (
              <BComboBox
                name={field.fieldName}
                context={context}
                dataSource={this.state.dataSourceList}
                multiSelect={false}
                multiColumn={false}
                onSelect={this.onCustomizationDataSelect.bind(this, 'ComponentPropertyForRequest#' + field.fieldName)}
                value={[field.fieldValue]}
                displayMemberPath="value"
                valueMemberPath="value"
                labelText={field.fieldName}
              />
            );
          });
          var requestFieldsDivider = divider;
          var requestFieldsLabel = (
            <BLabel context={context} text={getMessage('DynamicFormGenerator', 'RequestAreas')} style={labelStyle} />
          );
        }
        actionTypeDetailCard = (
          <BCard context={context}>
            <BComboBox
              ref={r => (this.request = r)}
              context={context}
              dataSource={this.state.requestList}
              multiSelect={false}
              multiColumn={false}
              onSelect={this.onCustomizationDataSelect.bind(this, 'Request')}
              value={[this.state.selectedAction.requestId]}
              displayMemberPath="requestName"
              valueMemberPath="requestId"
              labelText={getMessage('LogManager', 'Request')}
            />

            <BComboBox
              ref={r => (this.requestMethod = r)}
              context={context}
              dataSource={this.state.selectedAction.requestMethods}
              multiSelect={false}
              multiColumn={false}
              onSelect={this.onCustomizationDataSelect.bind(this, 'RequestMethod')}
              value={[this.state.selectedAction.requestMethodName]}
              displayMemberPath="methodName"
              valueMemberPath="methodName"
              labelText={getMessage('BusinessComponents', 'MethodName')}
            />

            {requestFieldsDivider}
            {requestFieldsLabel}
            {requestFields}
          </BCard>
        );
      }
    }

    let leftPaneContent = (
      <div className="b-dynamic-action-edit">
        <style>
          {`
            .b-dynamic-action-edit .actionListWrap { display:block; margin-bottom:15px; }
            .b-dynamic-action-edit .listItem {     
              overflow: hidden;
              position: relative;
              width: 100%;
              height: 36px;
              display: flex;
            }
            .b-dynamic-action-edit .gridcell {
              display: inline-block;
              position: relative;
              box-sizing: border-box;
              min-height: 36px;
              vertical-align: top;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .b-dynamic-action-edit .radioButton { width: 36px; }
            .b-dynamic-action-edit .actionButton { width: 210px; }
            .b-dynamic-action-edit .actionButton > div { width: 100%; }
            .b-dynamic-action-edit .actionButton button{
              justify-content: start!important;
              height: 36px!important;
              padding: 6px 16px;
              width: 100%;
            }
            .b-dynamic-action-edit .iconButton { width: 36px; }
            .b-dynamic-action-edit .iconButton button{ height: 36px; }
            .b-dynamic-action-edit .addButton > button { padding-left: 6px; width: 100%; justify-content: start; }
            .b-dynamic-action-edit .addButton svg { color: ${this.props.context.theme.boaPalette.pri500};}
          `}
        </style>

        <div className="actionListWrap">
          {this.state.formActionList.map((action: any) => {
            return (
              <div className="listItem">
                <div className="gridcell radioButton">
                  <BRadioButton context={context} value={action.actionId} onChange={this.onChangeRadio} checked={action.isSelected} />
                </div>
                <div className="gridcell actionButton">
                  <BActionButton context={context} action={action} onClick={this.onActionButtonClick.bind(this, action)} />
                </div>
                <div className="gridcell iconButton">
                  <BIconButton context={context} dynamicIcon={'Delete'} onClick={this.onDeleteActionClick.bind(this, action)} />
                </div>
              </div>
            );
          })}
        </div>
        <div className={'addButton'}>
          <BButton
            onClick={this.onAddNewActionClick}
            context={context}
            type="flat"
            text={getMessage('BusinessComponents', 'Add')}
            textPosition="after"
            dynamicIcon="Add"
          />
        </div>
      </div>
    );

    return (
      <BTransactionForm
        ref={r => (this.transactionForm = r)}
        disableCardWidth={true}
        {...this.props}
        context={context}
        onClosing={this.onClosing}
        cardSectionThresholdColumn={1}
        leftPaneContent={leftPaneContent}
        leftPaneWidth={330}
        onActionClick={e => {
          this.onActionClick(e);
        }}
      >
        <div>
          {detailContentCard}
          {ruleCard}
          {actionTypeDetailCard}
        </div>
      </BTransactionForm>
    );
  }
}

export default BDynamicActionEdit;
