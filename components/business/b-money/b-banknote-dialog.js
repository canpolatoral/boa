import React from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableHead, TableRow, TableCell, TableFooter } from '@material-ui/core';
import IHunterHelper from './i-hunter-helper';
import { BLocalization } from 'b-localization';
import { BBusinessComponent } from 'b-business-component';
import { BInputNumeric } from 'b-input-numeric';
import { BDialogHelper } from 'b-dialog-box';
import { BCard } from 'b-card';
import { BComponent } from 'b-component';
import { BTransactionForm } from 'b-transaction-form';
import { BFormManager } from 'b-form-manager';
import { BToggle } from 'b-toggle';
import cloneDeep from 'lodash/cloneDeep';
import { BRadioButton } from 'b-radio-button';

const radioLabelStyle = {
  fontSize: '13px',
  fontWeight: 500,
  color: '#000000'
};

export class BBanknoteDialog extends BBusinessComponent {
  static propTypes = {
    ...BBusinessComponent.propTypes,
    resourceInfo: PropTypes.any,
    resourceCode: PropTypes.string,
    tellerProcessTypeInfo: PropTypes.oneOf(['None', 'IHunter', 'ATS', 'XTM']),
    totalValue: PropTypes.number,
    banknoteList: PropTypes.any,
    canChangeTotalValue: PropTypes.bool,
    behaviourType: PropTypes.oneOf(['Deposit', 'Withdrawal']),
    FECCode: PropTypes.string,
    canEnterZeroValue: PropTypes.bool,
    isVisibleChangeTotal: PropTypes.bool,
    receivedChange: PropTypes.number,
    givenChange: PropTypes.number
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    resourceCode: 'YONTBNKNTD',
    tellerProcessTypeInfo: 'None',
    canChangeTotalValue: false,
    behaviourType: 'Deposit',
    FECCode: 'TL',
    canEnterZeroValue: false,
    isVisibleChangeTotal: true
  }

  constructor(props, context) {
    super(props, context);

    this.handleOnComponentToggle = this.handleOnComponentToggle.bind(this);

    this.rowRefs = [];
    let receivedState = [], givenState = [];
    this.initializeBankNoteStateArray(receivedState, 'received');
    this.initializeBankNoteStateArray(givenState, 'given');

    this.state = {
      givenTotal: this.props.givenTotal,
      receivedTotal: this.props.receivedTotal,
      givenChange: this.props.givenChange,
      receivedChange: this.props.receivedChange,
      clippingAmount: this.props.clippingAmount, // ekrandan girilen tutar
      selected: this.props.behaviourType == 'Deposit' ? 'received' : 'given',
      received: receivedState,
      given: givenState,
      receivedDisabled: this.props.behaviourType == 'Deposit' ? false : true,
      banknoteList: cloneDeep(this.props.banknoteList),
      showChangeLabel: true,
      currencyOpacity: 0,
      isToggled: false,
      isToggleDisabled: false,
      ignoreEnteredChangeKey: false
    };

    this.items1 = [
      {
        ref: r => this.rowRef.receivedRadioRef = r,
        label: this.getMessage('BusinessComponents', 'Received'), // 'Alınan',
        value: 'received',
        checked: 'received' == this.state.selected,
        labelStyle: radioLabelStyle
      }
    ];
    this.items2 = [
      {
        ref: r => this.rowRef.givenRadioRef = r,
        label: this.getMessage('BusinessComponents', 'Given'), // 'Verilen',
        value: 'given',
        checked: 'given' == this.state.selected,
        labelStyle: radioLabelStyle
      }
    ];
  }

  getSnapshot() {
    return {
      state: this.state
    };
  }

  setSnapshot(snapShot) {
    let snapState = { ...snapShot.state };
    this.setState(snapState);
  }

  checkDeviceFinished(connected: bool) {
    if (connected == false) {
      this.transactionForm.disableAction('IHunter');
      this.addMoneyToggle.setDisable(true);
      BFormManager.showStatusMessage(this.getMessage('BOA', 'CashCounterConnectionProcessFailed'));
    }
  }

  initializeBankNoteStateArray(array, type) {
    let list = cloneDeep(this.props.banknoteList);
    for (let index in list) {
      array[index] = type == 'clean' ? null : (type == 'received' ?
        (list[index].depositeCount == null ? (this.state.receivedChange == null ? null : this.state.receivedChange) : list[index].depositeCount + '') :
        (list[index].withdrawalCount == null ? (this.state.givenChange == null ? null : this.state.givenChange) : list[index].withdrawalCount + ''));
    }
  }

  actionBarButtonClick(e) {
    if (e.commandName == 'Ok')
      this.validateBankNote();
    else if (e.commandName == 'IHunter') {
      this.transactionForm.disableAction('IHunter');
      IHunterHelper.getBankNoteFromCounter(this.props.context, this.counterFinished.bind(this));
    }
    else if (e.commandName == 'Return') {
      this.initializeAllComponents();
    }
    else if (e.commandName == 'Clean') {
      this.cleanAll();
    }
  }

  initializeAllComponents() {
    this.getTotal(this.props.banknoteList, () => {
      for (let index in this.props.banknoteList) {
        let rowRef = this.rowRefs[index];
        rowRef.receivedInputRef.binput.getInstance().resetValue();
        rowRef.givenInputRef.binput.getInstance().resetValue();
      }
    });
  }

  /**
   * Handle function that is fired when the toggle switch is toggled.
   * @param event
   * @param isToggled
   */
  handleOnComponentToggle(event, isToggled) {
    this.setState({
      isToggled: isToggled
    });
  }
  componentDidMount() {
    if (this.state.totalValue != 0) {
      this.transactionForm.enableAction('Clean');
      this.transactionForm.enableAction('Return');
    }
    else {
      this.transactionForm.disableAction('Clean');
      this.transactionForm.disableAction('Return');

    }
  }
  counterFinished(data) {
    this.transactionForm.enableAction('IHunter');
    var moneyInputState = [];
    if (this.state.isToggled) {
      if (this.state.selected == 'received')
        moneyInputState = Object.assign([], this.state.received);
      else if (this.state.selected == 'given')
        moneyInputState = Object.assign([], this.state.given);
    }
    if (data) {
      for (var index in data) {
        var bankNote = data[index];
        var bankNoteTypeIndex = this.findBankNoteTypeIndex(bankNote.UnitPrice);
        var oldValue = moneyInputState[bankNoteTypeIndex];
        var realValue = oldValue ? (parseInt(oldValue) + parseInt(bankNote.DepositeCount)) : bankNote.DepositeCount;
        moneyInputState[bankNoteTypeIndex] = realValue.toString();
      }
      if (this.state.selected == 'received')
        this.setState({ received: moneyInputState }, this.getTotal);
      else if (this.state.selected == 'given')
        this.setState({ given: moneyInputState }, this.getTotal);
    }
  }

  differentAmountResponse(dialogResponse) {
    if (dialogResponse == BComponent.DialogResponse.YES) {
      BDialogHelper.close(this, dialogResponse,
        {
          totalValue: this.state.clippingAmount,
          banknoteList: this.state.banknoteList,
          givenTotal: this.state.givenTotal,
          receivedTotal: this.state.receivedTotal,
          receivedChange: this.state.receivedChange,
          givenChange: this.state.givenChange
        });
    }
  }

  validateBankNote() {
    if (this.state.clippingAmount < 0) {
      BFormManager.showStatusMessage(this.getMessage('BusinessComponents', 'BanknoteAmountCanNotBeLessThanZero'));
      return;
    }
    if (this.props.canEnterZeroValue == false && this.state.clippingAmount == 0) {
      BFormManager.showStatusMessage(this.getMessage('BusinessComponents', 'BanknoteAmountCanNotBeZero'));
      return;
    }
    else if (this.props.totalValue != this.state.clippingAmount) {
      if (this.props.canChangeTotalValue) {
        if (this.props.totalValue != 0) {
          BDialogHelper.show(
            this.props.context,
            this.getMessage('BusinessComponents', 'DoYouChangeAmountNotMatchDesiredAndOptionAmount'), // 'İstenen tutar ile küpür tutarı aynı değil. Değiştirmek istiyor musunuz?',
            BComponent.DialogType.QUESTION,
            BComponent.DialogResponseStyle.YESCANCEL,
            null,
            this.differentAmountResponse.bind(this)
          );
          return;
        }
      }
      else {
        BDialogHelper.show(
          this.props.context,
          this.getMessage('BusinessComponents', 'NotMatchDesiredAndOptionAmount'), // 'İstenen tutar ile küpür tutarı aynı değil.',
          BComponent.DialogType.QUESTION,
          BComponent.DialogResponseStyle.OK,
          null,
          null
        );
        return;
      }
    }
    BDialogHelper.close(
      this,
      BComponent.DialogResponse.YES,
      {
        totalValue: this.state.clippingAmount,
        banknoteList: this.state.banknoteList,
        givenTotal: this.state.givenTotal,
        receivedTotal: this.state.receivedTotal,
        receivedChange: this.state.receivedChange,
        givenChange: this.state.givenChange
      });
  }

  findBankNoteTypeIndex(unitPrice) {
    if (this.props.banknoteList) {
      for (let index in this.props.banknoteList) {
        if (this.props.banknoteList[index].unitPrice == unitPrice) {
          return index;
        }
      }
    }
    return null;
  }

  onInputChange(e, val) {
    // console.log("onInput" + val)
    let banknoteListState = cloneDeep(this.state.banknoteList);
    for (let index in banknoteListState) {
      {
        if ((banknoteListState[index].unitPrice + 'received') == e.target.name) {
          banknoteListState[index].depositeCount = val;
          if (banknoteListState[index].unitPrice == -1) {
            this.setState({ receivedChange: val });
            banknoteListState[index].depositeCount = null;
            banknoteListState[index].withdrawalCount = null;
          }

        } else if ((banknoteListState[index].unitPrice + 'given') == e.target.name) {
          banknoteListState[index].withdrawalCount = val;
          if (banknoteListState[index].unitPrice == -1) {
            this.setState({ givenChange: val });
            banknoteListState[index].depositeCount = null;
            banknoteListState[index].withdrawalCount = null;
          }
        }
      }
    }
    setTimeout(() => {
      this.getTotal(banknoteListState);
    }, 100);
  }

  getTotal(banknoteListState, callback) {
    if (banknoteListState) {
      let receivedTotal = 0, givenTotal = 0;
      let receivedState = [], givenState = [];
      this.initializeBankNoteStateArray(receivedState, 'clean');
      this.initializeBankNoteStateArray(givenState, 'clean');

      for (let index in banknoteListState) {
        var item = banknoteListState[index];
        let unitPrice = item.unitPrice > 0 ? item.unitPrice : 1;

        receivedState[index] = item.depositeCount + '';
        givenState[index] = item.withdrawalCount + '';

        if (item.depositeCount == null && item.withdrawalCount == null) {
          receivedTotal += parseFloat(this.state.receivedChange ?
            (this.state.receivedChange == null ? 0 : this.state.receivedChange) :
            (this.rowRefs[index].receivedInputRef.getValue() == null ? 0 : this.rowRefs[index].receivedInputRef.getValue()));
          givenTotal += parseFloat(this.state.givenChange ?
            (this.state.givenChange == null ? 0 : this.state.givenChange) :
            (this.rowRefs[index].givenInputRef.getValue() == null ? 0 : this.rowRefs[index].givenInputRef.getValue()));
        }
        else {
          receivedTotal += parseFloat(unitPrice * item.depositeCount);
          givenTotal += parseFloat(unitPrice * item.withdrawalCount);
        }

        item.depositeAmount = unitPrice * item.depositeCount;
        item.withdrawalAmount = unitPrice * item.withdrawalCount;
      }

      if (givenTotal == null || isNaN(givenTotal))
        givenTotal = 0;

      if (receivedTotal == null || isNaN(receivedTotal))
        receivedTotal = 0;

      this.setState({
        received: receivedState,
        given: givenState,
        givenTotal: givenTotal,
        receivedTotal: receivedTotal,
        clippingAmount: this.props.behaviourType == 'Deposit' ? (receivedTotal - givenTotal) : (givenTotal - receivedTotal),
        banknoteList: banknoteListState
      }, () => {
        if (callback)
          callback();
      });

      if (this.state.givenTotal != 0 || this.state.receivedTotal != 0) {
        this.transactionForm.enableAction('Clean');
        this.transactionForm.enableAction('Return');

      }
    }
    else {
      // counterdan gelen değerlerin hesaplanması
      let receivedTotal = 0, givenTotal = 0;
      let banknoteListState2 = cloneDeep(this.props.banknoteList);

      for (let index in banknoteListState2) {
        var item1 = banknoteListState2[index];
        let unitPrice = item1.unitPrice > 0 ? item1.unitPrice : 1;

        let receivedValue = this.state.received[index] ? this.state.received[index] : '0';
        let givenValue = this.state.given[index] ? this.state.given[index] : '0';

        if (item1.unitPrice == -1) {
          receivedValue = this.rowRefs[index].receivedInputRef.getInstance().getValue() > 0 ? this.rowRefs[index].getInstance().getValue() : '0';
          givenValue = this.rowRefs[index].givenInputRef.getInstance().getValue() > 0 ? this.rowRefs[index].getInstance().getValue() : '0';
        }

        receivedTotal += unitPrice * receivedValue;
        givenTotal += unitPrice * givenValue;

        item1.depositeCount = receivedValue;
        item1.depositeAmount = unitPrice * receivedValue;
        item1.withdrawalCount = givenValue;
        item1.withdrawalAmount = unitPrice * givenValue;

        let rowRef = this.rowRefs[index];
        if (this.state.selected == 'received')
          rowRef.receivedInputRef.binput.getInstance().setValue(this.state.received[index]);
        else
          rowRef.givenInputRef.binput.getInstance().setValue(this.state.given[index]);

      }
      this.setState({
        givenTotal: givenTotal,
        receivedTotal: receivedTotal,
        clippingAmount: this.props.behaviourType == 'Deposit' ? (receivedTotal - givenTotal) : (givenTotal - receivedTotal),
        banknoteList: banknoteListState2
      });
    }
  }

  cleanAll() {
    let receivedState = Object.assign([], this.state.received);
    let givenState = Object.assign([], this.state.given);
    this.initializeBankNoteStateArray(receivedState, 'clean');
    this.initializeBankNoteStateArray(givenState, 'clean');


    let banknoteList = this.state.banknoteList.map(item => (
      {
        ...Object.assign(item, { depositeCount: 0, withdrawalCount: 0 })
      }));
    /* let rowRef = this.rowRefs[index];
    rowRef.receivedInputRef.resetValue();
    rowRef.givenInputRef.resetValue(); */


    this.setState({
      received: receivedState,
      given: givenState,
      givenTotal: '0',
      receivedTotal: '0',
      clippingAmount: '0',
      banknoteList,
    }, );

  }

  onBankNoteRadioChange(event) {
    var newSelection = event.target.value;
    if (newSelection == 'received') {
      this.setState({ selected: 'received', receivedDisabled: false });
    }
    else if (newSelection == 'given') {
      this.setState({ selected: 'given', receivedDisabled: true });
    }
  }

  getStripedStyle(index) {
    return { background: index % 2 ? 'inherit' : this.props.context.theme.boaPalette.base10 };
  }

  onBlur = (iRef, arrayIndex, type) => {
    if (type == 'received') {
      let list = this.state.received;
      list[arrayIndex] = iRef.getValue();
      this.setState({ received: list });
    }
    else {
      let list = this.state.given;
      list[arrayIndex] = iRef.getValue();
      this.setState({ given: list });
    }
  }

  isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  onKeyUp(event) {
    if (event.key == ',') {
      this.setState({ ignoreEnteredChangeKey: true });
      // this.onInputChange(event, event.target.value + event.key);
    }

    if (event.key == 'ArrowDown' || event.key == 'ArrowUp') {
      let value = event.target.value;
      if (value != '' && this.isNumber(value)) {
        this.onInputChange(event, Number(value));
      } 
    }
  }

  render() {
    let receivedState = this.state.received;
    let givenState = this.state.given;
    let banknoteListState = this.state.banknoteList;
    let receivedChange = this.state.receivedChange;
    let givenChange = this.state.givenChange;

    let bankNoteRows = banknoteListState.map((unit, index) => {
      var bankNoteTypeIndex = this.findBankNoteTypeIndex(unit.unitPrice);

      var rowRef = this.rowRefs[bankNoteTypeIndex] = { unitPrice: unit.name, receivedInputRef: null, givenInputRef: null };
      this.rowRefs[bankNoteTypeIndex] = rowRef;

      let receivedDisable = this.state.receivedDisabled;
      let givenDisable = this.state.receivedDisabled == true ? false : true;

      let receivedValue = receivedState[bankNoteTypeIndex];
      let givenValue = givenState[bankNoteTypeIndex];
      let otherProps = {};
      let otherProps2 = {};
      if (banknoteListState[bankNoteTypeIndex].depositeCount == null) {
        if (unit.unitPrice == -1)  /* changeAmount */
          if (this.state.ignoreEnteredChangeKey)
            otherProps = null;
          else
            otherProps.value = (parseFloat(receivedChange) < 0.01 ? '' : receivedChange);
        else
          banknoteListState[bankNoteTypeIndex].depositeCount + '';
      }
      else if (banknoteListState[bankNoteTypeIndex].depositeCount == 0) {
        otherProps.value = '';
      }
      if (banknoteListState[bankNoteTypeIndex].withdrawalCount == null) {
        if (unit.unitPrice == -1)
          if (this.state.ignoreEnteredChangeKey)
            otherProps2 = null;
          else
            otherProps2.value = (parseFloat(givenChange) < 0.01 ? '' : givenChange);
        else
          banknoteListState[bankNoteTypeIndex].withdrawalCount + '';
      }
      else if (banknoteListState[bankNoteTypeIndex].withdrawalCount == 0) {
        otherProps2.value = '';
      }

      return (
        <TableRow key={'moneyrow_' + unit.name} displayBorder={true} style={{ alignContent: 'stretcht', border: '1px solid rgb(224, 224, 224)', height: '24px', ...this.getStripedStyle(index) }}>
          <TableCell style={{ border: 'solid rgb(224, 224, 224)', paddingLeft: '24px', height: '24px' }}>
            <div>{unit.name}</div>
          </TableCell>
          <TableCell style={{ border: 'solid rgb(224, 224, 224)', paddingLeft: '0px', paddingRight: '0px', height: '36px' }}>
            <BInputNumeric context={this.props.context}
              inlineGridMode={true}
              multiLine={false}
              ref={r => rowRef.receivedInputRef = r}
              name={unit.unitPrice + 'received'}
              defaultValue={(receivedValue == 0 || receivedValue == '0') ? '' : receivedValue}
              disabled={receivedDisable}
              onChange={this.onInputChange.bind(this)}
              underlineStyle={{ bottom: '0px', borderBottom: 'none' }}
              underlineDisabledStyle={{ display: 'none' }}
              underlineFocusStyle={{ borderBottom: ' solid rgb(25, 118, 210)' }}
              inputAlign={'center'}
              textSize='14px'
              style={{ height: '24px' }}
              inputStyle={{ height: '24px' }}
              format={unit.unitPrice == -1 ? 'M' : 'D'}
              onBlur={unit.unitPrice == -1 ? () => this.onBlur(rowRef.receivedInputRef, bankNoteTypeIndex, 'received') : null}
              {...otherProps}
              // value={!banknoteListState[bankNoteTypeIndex].depositeCount ? null : banknoteListState[bankNoteTypeIndex].depositeCount == 0 ? '' : banknoteListState[bankNoteTypeIndex].depositeCount + ''}
              onKeyUp={this.onKeyUp.bind(this)}
              maxLength={7}
              hideshowMarginTop={true} />
          </TableCell>
          <TableCell style={{ border: 'solid rgb(224, 224, 224)', paddingLeft: '0px', paddingRight: '0px'/* , height: '36px' */ }}>
            <BInputNumeric context={this.props.context}
              inlineGridMode={true}
              multiLine={false}
              ref={r => rowRef.givenInputRef = r}
              name={unit.unitPrice + 'given'}
              defaultValue={(givenValue == 0 || givenValue == '0') ? '' : givenValue}
              disabled={givenDisable}
              onChange={this.onInputChange.bind(this)}
              underlineStyle={{ bottom: '0px', borderBottom: 'none' }}
              underlineDisabledStyle={{ display: 'none' }}
              underlineFocusStyle={{ borderBottom: ' solid rgb(25, 118, 210)' }}
              inputAlign={'center'}
              style={{ height: '24px' }}
              inputStyle={{ height: '24px' }}
              format={unit.unitPrice == -1 ? 'M' : 'D'}
              onBlur={unit.unitPrice == -1 ? () => this.onBlur(rowRef.givenInputRef, bankNoteTypeIndex, 'given') : null}
              {...otherProps2}
              onKeyUp={this.onKeyUp.bind(this)}
              // value={banknoteListState[bankNoteTypeIndex].withdrawalCount == 0 ? '' : banknoteListState[bankNoteTypeIndex].withdrawalCount + ''}
              maxLength={7}
              hideshowMarginTop={true} />

          </TableCell>
        </TableRow>
      );
    });
    return (
      <BTransactionForm context={this.props.context}
        ref={r => this.transactionForm = r}
        resourceInfo={this.props.resourceInfo}
        onActionClick={this.actionBarButtonClick.bind(this)}
        cardSectionThresholdColumn={1}
        inDialog={true}
        style={{ alignContent: 'stretcht' }} >
        <div style={{ marginLeft: '24px', marginRight: '24px', marginBottom: '24px', marginTop: '0px' }}>
          <BCard context={this.props.context} expandable={false} initiallyExpanded={false}
            style={{
              overflowX: 'auto', alignContent: 'stretcht', minwidth: '600px', marginLeft: '0px', paddingLeft: '0px', marginTop: '0px',
              paddingRight: '0px', marginRight: '0px', display: 'flex', paddingBotton: '0px'
            }}>

            <div style={{ display: 'inline-grid', marginLeft: '0px', paddingLeft: '0px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '3px' }}>
                <div style={{ fontSize: '14px', marginLeft: '24px', fontWeight: 600, color: this.props.context.theme.boaPalette.base400 }}>{this.getMessage('BusinessComponents', 'RequestedAmount')}: </div>
                <div style={{ marginLeft: '16px', fontSize: '18px', fontWeight: 500, color: this.props.context.theme.boaPalette.base500 }}>{BLocalization.formatCurrency((this.props.totalValue || 0), 'M')}</div>
                <div style={{ marginLeft: '4px', fontSize: '13px', fontWeight: 500, color: this.props.context.theme.boaPalette.base500 }}>{this.props.FECCode}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '5px' }}>
                <div style={{ fontSize: '14px', marginLeft: '24px', fontWeight: 600, color: this.props.context.theme.boaPalette.base400 }}>{this.getMessage('BusinessComponents', 'BanknoteAmountLabel')}: </div>
                <div style={{ marginLeft: '16px', fontSize: '18px', fontWeight: 500, color: this.props.context.theme.boaPalette.base500 }}>{BLocalization.formatCurrency(this.state.clippingAmount || 0, 'M')}</div>
                <div style={{ marginLeft: '4px', fontSize: '13px', fontWeight: 500, color: this.props.context.theme.boaPalette.base500 }}>{this.props.FECCode}</div>
              </div>
              <div style={{ fontSize: '14px', marginLeft: '24px', fontWeight: 500, color: this.props.context.theme.boaPalette.base400, marginBottom: '5px' }}>
                {(this.props.tellerProcessTypeInfo == 'IHunter') &&
                  <BToggle
                    ref={r => this.addMoneyToggle = r}
                    context={this.props.context}
                    defaultToggled={this.state.isToggled}
                    onToggle={this.handleOnComponentToggle}
                    disabled={this.props.isToggleDisabled}
                    labelStyle={{ fontSize: '14px', color: this.props.context.theme.boaPalette.base400 }}
                    label={this.getMessage('BusinessComponents', 'AddCountedMoney')} />}
              </div>
            </div>
            <Table /* classes={{ maxWidth: '600px' }}   classes={{ maxWidth: '600px' }} */ context={this.props.context} selectable={false} style={{ width: '600px', overflowX: 'auto', marginLeft: '0px', marginRight: '0px', paddingRight: '0px', display: 'inherit' }}>
              <TableHead context={this.props.context} displaySelectAll={false} enableSelectAll={false} adjustForCheckbox={false} style={{ border: '1px solid rgb(224, 224, 224)' }} >
                <TableRow context={this.props.context} displayBorder={true} style={{ height: '36px' }}>
                  <TableCell context={this.props.context} style={{ border: '1px solid rgb(224, 224, 224)', paddingLeft: '24px', paddingRight: '12px', height: '36px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#000000' }}>{this.getMessage('BusinessComponents', 'Banknote')}</div>
                  </TableCell>
                  <TableCell context={this.props.context}
                    style={{
                      border: '1px solid rgb(224, 224, 224)', paddingLeft: '24px', height: '36px',
                      backgroundColor: this.state.selected == 'received' ? this.props.context.theme.boaPalette.pri250 : 'inherit'
                    }}>
                    <BRadioButton context={this.props.context}
                      style={{ display: 'flex', fontWeight: 600 }}
                      defaultChecked='true'
                      name='bankNoteRadio'
                      onChange={this.onBankNoteRadioChange.bind(this)}
                      label={this.getMessage('BusinessComponents', 'Received')}
                      value='received'
                      key='received'
                      checked={'received' == this.state.selected}
                      onChange={this.onBankNoteRadioChange.bind(this)}
                      ref={r => this.receivedRadioRef = r} />
                  </TableCell>
                  <TableCell context={this.props.context}
                    style={{
                      border: '1px solid rgb(224, 224, 224)', paddingLeft: '24px', height: '36px',
                      backgroundColor: this.state.selected == 'given' ? this.props.context.theme.boaPalette.pri250 : 'inherit'
                    }}>
                    <BRadioButton context={this.props.context}
                      style={{ display: 'flex', fontWeight: 600 }}
                      defaultChecked='true'
                      name='bankNoteRadio2'
                      onChange={this.onBankNoteRadioChange.bind(this)}
                      label={this.getMessage('BusinessComponents', 'Given')}
                      value='given'
                      key={this.items2.value}
                      checked={'given' == this.state.selected}
                      onChange={this.onBankNoteRadioChange.bind(this)}
                      ref={r => this.givenRadioRef = r} />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody context={this.props.context} displayRowCheckbox={false}>

                {bankNoteRows}

              </TableBody>
              <TableFooter context={this.props.context} adjustForCheckbox={false}>
                <TableRow context={this.props.context} displayBorder={true} style={{ border: '1px solid rgb(224, 224, 224)', height: '36px', ...this.getStripedStyle(bankNoteRows ? bankNoteRows.length : 0) }}>
                  <TableCell context={this.props.context} style={{ border: '1px solid rgb(224, 224, 224)', paddingLeft: '24px', height: '36px', verticalAlign: 'middle' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: this.props.context.theme.boaPalette.base450, }}>{this.getMessage('BusinessComponents', 'Total')}</div>
                  </TableCell>
                  <TableCell context={this.props.context} style={{ border: '1px solid rgb(224, 224, 224)', paddingLeft: '12px', height: '36px', verticalAlign: 'middle' }}>
                    <div style={{ fontSize: '14px', color: this.props.context.theme.boaPalette.base450, textAlign: 'center', fontWeight: 600 }}>
                      {BLocalization.formatCurrency((this.state.receivedTotal || 0), 'M')}
                      <span style={{ marginLeft: '4px', fontSize: '11px', fontWeight: 600 }} >{this.props.FECCode}</span>
                    </div>
                  </TableCell>
                  <TableCell context={this.props.context} style={{ border: '1px solid rgb(224, 224, 224)', paddingLeft: '12px', height: '36px', verticalAlign: 'middle' }}>
                    <div style={{ fontSize: '14px', color: this.props.context.theme.boaPalette.base450, textAlign: 'center', fontWeight: 600 }}>
                      {BLocalization.formatCurrency((this.state.givenTotal || 0), 'M')}
                      <span style={{ marginLeft: '4px', fontSize: '11px', fontWeight: 600 }} >{this.props.FECCode}</span>
                    </div>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>

            (this.state.showChangeLabel) ?
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', padding: '0px', marginTop: '16px' }}>
              <div style={{ fontSize: '14px', color: this.props.context.theme.boaPalette.base400, paddingRight: '106px' }}>{this.getMessage('BusinessComponents', 'Change')} </div>
              <div style={{ marginLeft: '16px', fontSize: '18px', fontWeight: 600, color: this.props.context.theme.boaPalette.base500 }}>{BLocalization.formatCurrency((this.state.receivedTotal - this.state.givenTotal - this.props.totalValue) > 0 ? (this.state.receivedTotal - this.state.givenTotal - this.props.totalValue) : 0, 'M')}</div>
              <div style={{ marginLeft: '4px', marginRight: '24px', fontSize: '16px', fontWeight: 600, color: this.props.context.theme.boaPalette.base500 }}>{this.props.FECCode}</div>
            </div>
            :
            <div />

          </BCard>
        </div>
      </BTransactionForm>
    );
  }
}

export default BBanknoteDialog;
