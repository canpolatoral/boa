import React from 'react'; import PropTypes from 'prop-types';

import { BComponent } from 'b-component';
import { BTransactionForm } from 'b-transaction-form';
import { BCard } from 'b-card';
import { BBusinessComponent } from 'b-business-component';
import { BComboBox } from 'b-combo-box';
import { BInput } from 'b-input';
import { BCheckBox } from 'b-check-box';
import { BIconButton } from 'b-icon-button';
import { BDialogHelper } from 'b-dialog-box';
import { BMessagingComponent } from 'b-messaging-component';

/*
  Dinamik ekranda kullanılmak için oluşturuldu. Özelleştirilebilir.
*/
export class BStoredProcedureViewerDialog extends BBusinessComponent {
  static propTypes = {
    ...BBusinessComponent.propTypes,
    spList: PropTypes.array,
    spComboList: PropTypes.array,
    resourceInfo: PropTypes.any,
    resourceCode: PropTypes.string,
    selectedParameters: PropTypes.array,
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    spList: [],
    spComboList: [],
    resourceCode: 'YONTSPVWDL'
  };

  constructor(props, context) {
    super(props, context);
    this.onSelect = this.onSelect.bind(this);
    this.onClosing = this.onClosing.bind(this);
    this.onActionClick = this.onActionClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.organizeState(nextProps, false);
  }

  componentWillMount() {
    super.componentWillMount();
    this.selectedSp = {};
    this.organizeState(this.props, true);
  }

  componentDidMount() {
    super.componentDidMount();
    // this.getStoredProcedures();
  }

  organizeState(props, isFirst) {
    if (isFirst || (props && props.selectedSpName && props.selectedSpName !== this.props.selectedSpName)) {
      this.setState({
        isFirst: isFirst,
        selectedSpName: props.selectedSpName,
        parameterList: props.selectedParameters ? props.selectedParameters : [],
        returnColumnList: props.selectedReturnColumns ? props.selectedReturnColumns : [],
        formatList: [
          {
            text: 'None',
            value: '0'
          }, {
            text: 'dd.MM.yyyy',
            value: '1'
          }, {
            text: 'dd MM yyyy',
            value: '2'
          }, {
            text: '#.#,##',
            value: '3'
          }]
      });
      this.selectedSp = this.props.spList.find(x => x.fullSpName === props.selectedSpName);
      if (this.selectedSp && !isFirst) {
        this.getParameters();
      }
    }
  }

  getValue() {
    this.selectedSp.parameterList = this.state.parameterList;
    this.selectedSp.returnColumnList = this.state.returnColumnList;

    if (this.selectedSp.parameterList) {
      this.selectedSp.parameterList.forEach((sp) => {
        sp.parameterValue = this[sp.parameterName].getInstance().getValue();
      });
    }
    return this.selectedSp;
  }

  render() {
    const parameterList = this.state.parameterList && this.state.parameterList.map((parameter) => {
      return (
        <BInput key={parameter.parameterName}
          ref={ref => this[parameter.parameterName] = ref}
          context={this.props.context}
          value={parameter.parameterValue}
          type='text'
          hintText={parameter.parameterName}
          floatingLabelText={parameter.parameterName}
          multiLine={true}
          rows={1}
          rowsMax={4}
        />
      );
    });

    const returnColumnList = this.state.returnColumnList && this.state.returnColumnList.map((returnColumn) => {
      var isChecked: bool = returnColumn.isShow ? true : false;
      var orderComponents = <div></div>;
      if (isChecked) {
        orderComponents =
          <div>
            <BIconButton
              key={'iup' + returnColumn.returnColumnName}
              ref={ref => this['iup' + returnColumn.returnColumnName] = ref}
              context={this.props.context}
              disabled={returnColumn.isMoveUpButtonDisabled}
              iconProperties={{ color: this.props.context.theme.boaPalette.info500 }}
              dynamicIcon={'ArrowUpward'}
              onClick={this.moveUpButtonClick.bind(this, returnColumn.returnColumnName)} />
            <BIconButton
              key={'idw' + returnColumn.returnColumnName}
              ref={ref => this['idw' + returnColumn.returnColumnName] = ref}
              context={this.props.context}
              disabled={returnColumn.isMoveDownButtonDisabled}
              iconProperties={{ color: this.props.context.theme.boaPalette.info500 }}
              dynamicIcon={'ArrowDownward'}
              onClick={this.moveDownButtonClick.bind(this, returnColumn.returnColumnName)} />
          </div>;
      }
      return (
        <div>
          <div style={{ display: 'inline-block', 'vertical-align': 'middle' }}>
            <BCheckBox
              key={'cbx' + returnColumn.returnColumnName}
              ref={ref => this['cbx' + returnColumn.returnColumnName] = ref}
              context={this.props.context}
              defaultChecked={isChecked}
              onCheck={this.onCheckColumnShow.bind(this, 'cbx' + returnColumn.returnColumnName)} />
          </div>
          <div style={{ display: 'inline-block', maxWidth: '191px', marginLeft: '24px' }}>
            <BMessagingComponent
              key={'msg' + returnColumn.returnColumnName}
              ref={ref => this['msg' + returnColumn.returnColumnName] = ref}
              context={this.props.context}
              selectedCode={returnColumn.returnColumnLabel}
              floatingLabelText={returnColumn.returnColumnName}
              hintText={returnColumn.returnColumnName}
              disabled={returnColumn.isMessageDisabled}
              onChange={this.onMessageChanged.bind(this, returnColumn.returnColumnName)} />
          </div>
          <div style={{ display: 'inline-block', width: '20px' }}></div>
          <div style={{ display: 'inline-block' }}>
            <BComboBox
              key={'cmb' + returnColumn.returnColumnName}
              ref={ref => this['cmb' + returnColumn.returnColumnName] = ref}
              context={this.props.context}
              labelText={'Format'}
              value={[returnColumn.format]}
              dataSource={this.state.formatList}
              displayMemberPath={'text'}
              valueMemberPath={'value'}
              disabled={returnColumn.isMessageDisabled}
              onSelect={this.onFormatChanged.bind(this, returnColumn.returnColumnName)} />
          </div>
          <div style={{ display: 'inline-block', 'vertical-align': 'middle', marginLeft: '24px' }}>
            {orderComponents}
          </div>
        </div>
      );
    });

    return (
      <BTransactionForm
        ref={r => this.transactionForm = r}
        onClosing={this.onClosing}
        onActionClick={this.onActionClick}
        context={this.props.context}
        resourceInfo={this.props.resourceInfo}
        isWideCardEnabled={true}
        disableCardWidth={true}
        inDialog={true} >
        <BCard
          context={this.props.context}
          column={0} >
          <div>
            <BComboBox
              context={this.props.context}
              hintText={this.getMessage('Workflow', 'StoredProcedureList')}
              labelText={this.getMessage('Workflow', 'StoredProcedureList')}
              displayLabelMemberPath={['text']}
              dataSource={this.props.spComboList}
              multiSelect={false}
              multiColumn={false}
              value={[this.state.selectedSpName]}
              displayMemberPath='text'
              valueMemberPath='value'
              onSelect={this.onSelect}
              isAllOptionIncluded={false} />
            {
              (parameterList && parameterList.length > 0) &&
              <div>
                <label style={{ color: this.props.context.theme.boaPalette.base400, marginTop: 24, fontWeight: '400', fontSize: '13pt' }}>Parameters</label>
                {parameterList}
              </div>
            }
            {
              (returnColumnList && returnColumnList.length > 0) &&
              <div>
                <label style={{ color: this.props.context.theme.boaPalette.base400, paddingTop: 24, fontWeight: '400', fontSize: '13pt' }}>Return Columns</label>
                {returnColumnList}
              </div>
            }
          </div>
        </BCard>
      </BTransactionForm>
    );
  }

  close(dialogResponse) {
    let data = dialogResponse === BComponent.DialogResponse.YES ? this.getValue() : null;
    BDialogHelper.close(this, dialogResponse, data);
  }

  onCheckColumnShow(key, e, isInputChecked) {
    var columnName = key.substring(3, key.length);
    if (this.state.returnColumnList && this.state.returnColumnList.length > 0) {
      var index = this.state.returnColumnList.findIndex(x => x.returnColumnName == columnName);
      if (index >= 0) {
        this.state.returnColumnList[index].isShow = isInputChecked;
        var newColumnlist = [];
        var selectedColumnCount = 0;
        this.state.returnColumnList.map((column) => {
          if (column.isShow) {
            selectedColumnCount = selectedColumnCount + 1;
          }
        });
        this.state.returnColumnList.map((column) => {
          if (column.isShow) {
            this.controlDisabledProp(column, newColumnlist.length, selectedColumnCount);
            newColumnlist.push(column);
          }
        });
        this.state.returnColumnList.map((column) => {
          if (!column.isShow) {
            this.controlDisabledProp(column, newColumnlist.length, selectedColumnCount);
            newColumnlist.push(column);
          }
        });
        this.setState({
          returnColumnList: []
        }, () => {
          this.setState({
            returnColumnList: newColumnlist
          });
        });
      }
    }
  }

  onMessageChanged(columnName, selectedCode) {
    if (columnName) {
      var index = this.state.returnColumnList.findIndex(x => x.returnColumnName == columnName);
      this.state.returnColumnList[index].returnColumnLabel = selectedCode;
    }
  }

  onFormatChanged(columnName, selectedIndex, selectedItems, selectedItem) {
    if (columnName) {
      var index = this.state.returnColumnList.findIndex(x => x.returnColumnName == columnName);
      if (selectedItem && selectedItem.length > 0) {
        this.state.returnColumnList[index].format = selectedItem[0];
      }
    }
  }

  moveDownButtonClick(columnName) {
    if (columnName) {
      this.changeOrder(columnName, true);
    }
  }

  moveUpButtonClick(columnName) {
    if (columnName) {
      this.changeOrder(columnName, false);
    }
  }

  onSelect(selectedIndexes, selectedItems, selectedValues) {
    if (selectedItems && selectedItems.length == 1 && this.state.selectedSpName !== selectedValues[0]) {
      this.selectedSp = this.props.spList.find(x => x.fullSpName === selectedValues[0]);
      this.setState({ isFirst: false, selectedSpName: this.selectedSp.fullSpName, parameterList: [], returnColumnList: [] });
      this.getParameters();
    }
  }

  changeOrder(columnName: string, increaseIndex: bool) {
    var newColumnList = [];
    var currentIndex = this.state.returnColumnList.findIndex(x => x.returnColumnName == columnName);
    var selectedColumnCount = 0;
    this.state.returnColumnList.map((column) => {
      if (column.isShow) {
        selectedColumnCount = selectedColumnCount + 1;
      }
    });
    this.state.returnColumnList.map((column, index) => {
      if (increaseIndex && (currentIndex == index || currentIndex + 1 == index)) {
        if (currentIndex == index) {
          this.controlDisabledProp(this.state.returnColumnList[index + 1], index, selectedColumnCount);
          newColumnList.push(this.state.returnColumnList[index + 1]);
        }
        else {
          this.controlDisabledProp(this.state.returnColumnList[index - 1], index, selectedColumnCount);
          newColumnList.push(this.state.returnColumnList[index - 1]);
        }
      }
      else if (!increaseIndex && (currentIndex == index || currentIndex - 1 == index)) {
        if (currentIndex - 1 == index) {
          this.controlDisabledProp(this.state.returnColumnList[index + 1], index, selectedColumnCount);
          newColumnList.push(this.state.returnColumnList[index + 1]);
        }
        else {
          this.controlDisabledProp(this.state.returnColumnList[index - 1], index, selectedColumnCount);
          newColumnList.push(this.state.returnColumnList[index - 1]);
        }
      }
      else {
        newColumnList.push(column);
      }
    });
    this.setState({
      returnColumnList: []
    }, () => {
      this.setState({
        returnColumnList: newColumnList
      });
    });
  }

  controlDisabledProp(column, index, length) {
    column.order = index;
    if (column.isShow) {
      column.isMessageDisabled = false;
      if (length == 1) {
        column.isMoveDownButtonDisabled = true;
        column.isMoveUpButtonDisabled = true;
      }
      else if (index == 0) {
        column.isMoveDownButtonDisabled = false;
        column.isMoveUpButtonDisabled = true;
      }
      else if (index == length - 1) {
        column.isMoveDownButtonDisabled = true;
        column.isMoveUpButtonDisabled = false;
      }
      else {
        column.isMoveDownButtonDisabled = false;
        column.isMoveUpButtonDisabled = false;
      }
    }
    else {
      column.isMessageDisabled = true;
      column.isMoveDownButtonDisabled = true;
      column.isMoveUpButtonDisabled = true;
    }
  }

  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'SelectSpParametersAndReturnColumns':
        if (response.success) {
          // başarılıysa
          var parameterList = [];
          var returnColumnList = [];
          response.value && response.value.item1 && response.value.item1.map((parameter) => {
            parameterList.push(parameter);
          });
          response.value && response.value.item2 && response.value.item2.map((column, index) => {
            column.order = index;
            column.format = '0';
            column.isShow = false;
            column.isMessageDisabled = true;
            column.isMoveDownButtonDisabled = true;
            column.isMoveUpButtonDisabled = true;
            returnColumnList.push(column);
          });
          this.setState({
            parameterList: parameterList,
            returnColumnList: returnColumnList
          });
        } else {
          this.debugLog('error: getParameters method error: ' + proxyResponse.results[0].errorMessage, 3);
        }
        break;
      default:
        break;
    }
  }

  getParameters() {
    // let promise = this.proxyCall('BOA.Types.DynamicFormGenerator.SpBrowserRequest', {
    //   MethodName: 'SelectSpParametersAndReturnColumns',
    //   DataContract: this.selectedSp,
    //   resourceId: 6321
    // });

    let proxyRequest = {
      requestClass: 'BOA.Types.DynamicFormGenerator.SpBrowserRequest',
      requestBody: {
        MethodName: 'SelectSpParametersAndReturnColumns',
        DataContract: this.selectedSp,
        resourceId: '6321'
      },
      key: 'SelectSpParametersAndReturnColumns',
    };
    this.proxyExecute(proxyRequest);

    // promise.then((result) => {
    //   if (!result.success) {
    //     this.debugLog('error: getParameters method error: ' + result.results[0].errorMessage, 3);
    //   } else {
    //     var parameterList = [];
    //     var returnColumnList = [];
    //     result.value && result.value.item1 && result.value.item1.map((parameter) => {
    //       parameterList.push(parameter);
    //     });
    //     result.value && result.value.item2 && result.value.item2.map((column, index) => {
    //       column.order = index;
    //       column.format = '0';
    //       column.isShow = false;
    //       column.isMessageDisabled = true;
    //       column.isMoveDownButtonDisabled = true;
    //       column.isMoveUpButtonDisabled = true;
    //       returnColumnList.push(column);
    //     });
    //     this.setState({
    //       parameterList: parameterList,
    //       returnColumnList: returnColumnList
    //     });
    //   }
    // }, (error) => {
    //   this.debugLog('error: getStoredProcedures method error: ' + error, 3);
    // });
  }

  handleClose() {
    this.close(BComponent.DialogResponse.NONE);
  }

  onActionClick() {
    this.close(BComponent.DialogResponse.YES);
  }

  onClosing() {
    this.close(BComponent.DialogResponse.NONE);
  }
}

export default BStoredProcedureViewerDialog;
