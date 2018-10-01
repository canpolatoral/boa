import React from 'react'; import PropTypes from 'prop-types';
import Xlsx from 'xlsx';
import ListDialog from './ListDialog';
import GridDialog from './GridDialog';

import { BComponent, BComponentComposer } from 'b-component';
import { BInputAction } from 'b-input-action';
import { BDialogHelper } from 'b-dialog-box';

var ValueType;
(function (ValueType) {
  ValueType[ValueType['STRING'] = '1'] = 'STRING';
  ValueType[ValueType['INT'] = '2'] = 'INT';
  ValueType[ValueType['DATE_TIME'] = '3'] = 'DATE_TIME';
  ValueType[ValueType['ALL_TYPE'] = '99'] = 'ALL_TYPE';
})(ValueType || (ValueType = {}));
@BComponentComposer
export class BExcelBrowser extends BComponent {

  static propTypes = {
    /**
    * Base properties from BBusinessComponent.
    */
    ...BComponent.props,
    /**
    * Text prop of floating label.
    */
    floatingLabelText: PropTypes.string,
    /**
    * Hint text property.
    */
    hintText: PropTypes.string,
    /**
    * Error text property.
    */
    errorText: PropTypes.string,
    /**
    * Indicates the input is disable or not.
    */
    disabled: PropTypes.bool,
    /**
    * Indicates the input is numeric or not.
    */
    isNumeric: PropTypes.bool,
    /**
    * Indicates the type of input value.
    */
    valueType: PropTypes.string
  };

  static defaultProps = {
    /**
    * Default prop values from BComponent
    */
    ...BComponent.defaultProps,
    floatingLabelText: '',
    hintText: '',
   // errorText: '',
    disabled: false,
    isNumeric: false,
    valueType: ValueType.INT
  };

  state = {
    errorText: '',
    value: '',
    displayText: '',
  };

  _clearActionButton = { dynamicIcon: 'Clear', iconProperties: { 'style': { color: this.props.context.theme.boaPalette.base400 } }, onClick: this.clearButtonClicked.bind(this) };
  _addDirectActionButton = { dynamicIcon: 'Create', iconProperties: { 'style': { color: this.props.context.theme.boaPalette.base400 } }, onClick: this.addDirectClicked.bind(this) };
  _addTableActionButton = { dynamicIcon: 'GridOn', iconProperties: { 'style': { color: this.props.context.theme.boaPalette.base400 } }, onClick: this.addTableClicked.bind(this) };
  _addExcelActionButton = { dynamicIcon: 'AddBox', iconProperties: { 'style': { color: this.props.context.theme.boaPalette.base400 } }, onClick: this.addExcelClicked.bind(this) };

  constructor(props, context) {
    super(props, context);
  }

  clearButtonClicked() {
    this.setValue('');
  }

  addDirectClicked() {
    let dialogStyle;
    if (this.props.context.deviceSize < BComponent.Sizes.MEDIUM) {
      dialogStyle = { width: '90%', height: '90%' };
    }
    else {
      dialogStyle = { width: '35%', height: '85%' };
    }

    let dialog = (
      <ListDialog
        context={this.props.context}
        value={this.state.value}
      />
    );

    BDialogHelper.show(this.props.context, dialog, 0, 0, this.props.floatingLabelText, this.onDialogClosed.bind(this), dialogStyle);
  }

  addTableClicked() {
    let dialogStyle;
    if (this.props.context.deviceSize < BComponent.Sizes.MEDIUM) {
      dialogStyle = { width: '90%', height: '90%' };
    }
    else {
      dialogStyle = { width: '75%', height: '85%' };
    }

    let dialog = (
      <GridDialog
        context={this.props.context}
        value={this.state.value}
      />
    );

    BDialogHelper.show(this.props.context, '', dialog, 0, 0, this.props.floatingLabelText, this.onDialogClosed.bind(this), dialogStyle);
  }

  addExcelClicked() {
    var _that = this;
    var input = $(document.createElement('input'));
    input.attr('type', 'file');
    input.attr('accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    input.on('change', function (e) {
      if (e.target.files.length > 0) {
        _that.readExcelData(e.target.files[0]);
      }
    });
    input.trigger('click'); // opening dialog
    return false; // avoiding navigation
  }

  onDialogClosed(dialogResponse, data) {
    if (dialogResponse == BComponent.DialogResponse.OK) {
      this.setValue(data);
    }
  }

  getValue() {
    var _that = this;
    var result = this.state.value;

    // String ise arraya donusturelim
    if (typeof result === 'string') {
      if (result == '') {
        result = [];
      }
      else {
        result = result.split('\n');
      }
      // Burasi bence cok mantikli degil ama listenin bos oldugu durumlarda da listenin tipinin anlasilabilmesi icin
      // listenin basina bos bir veri atilmali. Bu değer BusinessBus.ReportingEngine.Operation.AddParameters() içinde siliniyor.
      // result.unshift('1');
    }

    if (this.props.valueType == ValueType.ALL_TYPE) {
      // Eger dogrudan datatable isteniyorsa donelim
      return result;
    }
    else {
      // Datatable olmadigina gore her halukarda sadece ilk sutun donulecek.
      // Tipe gore donusturmeyi de burada yapalim.
      if (result.length > 0 && result[0] instanceof Array) {
        result = result.map(function (item) {
          var row = item[0];
          if (_that.props.valueType == ValueType.STRING) {
            return row;
          }
          else if (_that.props.valueType == ValueType.INT) {
            return parseInt(row, 10);
          }
          else if (_that.props.valueType == ValueType.DATE_TIME) {
            return new Date(row);
          }
        });
      }

      return result;
    }
  }

  setValue(value) {
    if (this.props.valueType == ValueType.ALL_TYPE) {
      // let displayText = 'Tablodan ' + value.length + ' veri girildi';
      let displayText = this.getMessage('BOA', 'EnteredDataFromTable');
      this.setState({ value: value, displayText: displayText });
    }
    else {
      let valueCount = typeof value === 'string' ? value.split('\n').length : value.length;
      let displayText = '';
      if (valueCount > 0) {
        displayText = typeof value === 'string' ? value.split('\n').join(', ') : this.getMessage('BOA', 'EnteredDataFromTable');
      }
      this.setState({ value: value, displayText: displayText });
    }
  }

  getSnapshot() {
    return { state: this.state };
  }

  setSnapshot(snapshot) {
    this.setState(snapshot.state);
  }

  readExcelData(file) {
    var _that = this;
    let reader = new FileReader();
    reader.onload = function (e) {
      let workbook = Xlsx.read(e.target.result, { type: 'binary' });
      let csv = Xlsx.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]);
      let result = csv.trim().split('\n').map((item) => {
        var row = item.split(',');
        while (row.length < 7) row.push('');
        return row.slice(0, 7);
      });

      _that.setValue(result);
    };
    reader.readAsBinaryString(file);
  }

  render() {
    return (
      <BInputAction
        context={this.props.context}
        inputDisabled={true}
        floatingLabelText={this.props.floatingLabelText}
        hintText={this.props.hintText}
        errorText={this.props.errorText}
        leftIconList={[]}
        rightIconList={this.getActionList()}
        disabled={this.props.disabled}
        value={this.state.displayText}
      />
    );
  }

  getActionList() {
    let actList = [];

    if (this.props.valueType == ValueType.ALL_TYPE) {
      if (this.tableValue) {
        actList.push(this._clearActionButton);
      }
    }
    else {
      if (this.value) {
        actList.push(this._clearActionButton);
      }

    }
    actList.push(this._addDirectActionButton);
    actList.push(this._addTableActionButton);
    actList.push(this._addExcelActionButton);

    return actList;
  }
}

export default BExcelBrowser;
