import React from 'react';
import { BButton } from 'b-button';
import { PropTypes } from 'prop-types';
import { BComponentComposer, BComponent } from 'b-component';
import { BBusinessComponent } from 'b-business-component';
import { BInputNumeric } from 'b-input-numeric';
import { BBanknoteDialog } from './b-banknote-dialog';
import { BDialogHelper } from 'b-dialog-box';
import { BLocalization } from 'b-localization';
import cloneDeep from 'lodash/cloneDeep';

@BComponentComposer
export class BMoney extends BBusinessComponent {

  static allBanknoteList = [];

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    totalMaximumValue: null,
    useGOVIfPossible: false,
    canTellerWorkWithoutSafeDefiniton: false,
    hasTellerTransactionListValue: false,
    showBankNoteButton: true,
    showInfoButton: false,
    showWarnings: true,
    FEC: 0,
    behaviourType: 'Deposit',
    canChangeTotalValue: true,
    canEnterZeroValue: false,
    isReadOnly: false,
    isChoosable: true,
    isVisibleChangeTotal: true,
    disabled: false
  }

  static propTypes = {
    /**
    * Base properties from BComponent
    */
    ...BBusinessComponent.propTypes,
    /**
    * The max value of progress, only works in determinate mode.
    */
    maxLength: PropTypes.any,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    /*
    The error text
    */
    errorText: PropTypes.string,
    floatingLabelText: PropTypes.string,
    disabled: PropTypes.bool,

    showBankNoteButton: PropTypes.bool,
    showInfoButton: PropTypes.bool,
    onInfoButtonClick: PropTypes.func,
    isReadOnly: PropTypes.bool,
    isChoosable: PropTypes.bool,
    useGOVIfPossible: PropTypes.bool,
    FEC: PropTypes.number,
    canChangeTotalValue: PropTypes.bool,
    totalValue: PropTypes.number,
    totalMaximumValue: PropTypes.number,
    behaviourType: PropTypes.oneOf(['Deposit', 'Withdrawal']),
    canTellerWorkWithoutSafeDefiniton: PropTypes.bool,
    hasTellerTransactionListValue: PropTypes.bool,
    showWarnings: PropTypes.bool,
    format: PropTypes.any,
    canEnterZeroValue: PropTypes.bool,
    isVisibleChangeTotal: PropTypes.bool
  }

  state = {
    currencyOpacity: 0,
    totalValue: this.props.totalValue, // talep edilen toplan tutar
    banknoteList: [],
    alignInputHintToRight:false
  }

  constructor(props, context) {
    super(props, context);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);

    this.rowRefs = [];
    this.tellerProcessTypeInfo = 'IHunter'; // normalde clientapplication contextten geliyor. defult none ama biz test için IHunter seçtik. None = 0, IHunter = 1,  ATS = 2, XTM = 5
    this.FECCode = 'TL';
    this.tellerTransactionList = [];
    this.banknoteEntered = false;
  }

  componentWillMount() {
    super.componentWillMount();
    this.hintTextRight = '2px';
    if (this.props.showBankNoteButton && this.props.showInfoButton)
      this.hintTextRight = '48px';
    else if (this.props.showBankNoteButton || this.props.showInfoButton)
      this.hintTextRight = '28px';

    if (this.props.totalValue)
      this.setState({ currencyOpacity: 1 });

    this.getFECBanknoteList(this.props.FEC);
    this.hasTellerProcessInfo = this.props.context.applicationContext.hasTellerProcessInfo;

  }

  componentDidMount() {
    super.componentDidMount();
    if (this.bInputNumeric.getValue() != null && this.bInputNumeric.getValue().toString() == '0')
      this.setState({ totalValue: '' });
  }
  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    if (nextProps.FEC != this.props.FEC)
      this.getFECBanknoteList(nextProps.FEC);

    if (nextProps.totalValue != this.props.totalValue) {
      this.setState({ totalValue: nextProps.totalValue });
      if (nextProps.totalValue)
        this.setState({ currencyOpacity: 1 });
      else {
        this.setState({ currencyOpacity: 0 });
      }
    }
    this.hintTextRight = '2px';
    if (nextProps.showBankNoteButton && nextProps.showInfoButton)
      this.hintTextRight = '48px';
    else if (nextProps.showBankNoteButton || nextProps.showInfoButton)
      this.hintTextRight = '28px';
  }

  getFECBanknoteList(FEC) {

    if (BMoney.allBanknoteList && BMoney.allBanknoteList != null && BMoney.allBanknoteList.length > 0) {
      this.tempList = [];
      for (var i = 0; i < BMoney.allBanknoteList.length; i++) {
        // var f = BMoney.allBanknoteList[i].fec;
        var item = BMoney.allBanknoteList[i];
        var f = item.fec;
        if (f == FEC) {
          item.depositeCount = 0;
          item.depositeAmount = 0;
          item.withdrawalCount = 0;
          item.withdrawalAmount = 0;
          this.tempList.push(item);
        }
      }
      this.sortedList = this.tempList.sort((a, b) => { return b.unitPrice - a.unitPrice; });
      this.fillTellerTransactionList(this.sortedList);
      this.setFECCode();
      this.setState({ banknoteList: this.sortedList });
    } else {
      this.getAllBanknoteList(FEC);
    }
  }

  setFECCode() {
    this.FECCode = this.tempList[0].fecCode;
  }

  getAllBanknoteList(FEC) {
    if (BMoney.allBanknoteList == null || BMoney.allBanknoteList.length == 0) {
      BMoney.allBanknoteList = [];
      let proxyRequest = {
        requestClass: 'BOA.Types.Kernel.BusinessHelper.BanknoteRequest',
        requestBody: {
          MethodName: 'GetAllBanknotes'
        },
        key: 'getAllBanknoteList',
        params: { FEC }
      };
      this.proxyExecute(proxyRequest);
    }
  }

  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'getAllBanknoteList':
        if (response.success) {
          let { FEC } = proxyResponse.params;
          BMoney.allBanknoteList = response.value;
          this.tempList = [];
          for (var i = 0; i < BMoney.allBanknoteList.length; i++) {
            var item = BMoney.allBanknoteList[i];
            var f = item.fec;
            if (f == FEC) {
              item.depositeCount = 0;
              item.depositeAmount = 0;
              item.withdrawalCount = 0;
              item.withdrawalAmount = 0;
              this.tempList.push(item);
            }
          }
          this.sortedList = this.tempList.sort((a, b) => { return b.unitPrice - a.unitPrice; });
          this.fillTellerTransactionList(this.sortedList);
          this.setState({ banknoteList: this.sortedList }, this.setFECCode);
        }
        break;

      default:
        break;
    }
  }

  fillTellerTransactionList(list) {
    this.tellerTransactionList = [];
    for (var i = 0; i < list.length; i++) {
      this.tellerTransactionList.push({
        depositCount: list[i].depositeCount,
        description: '',
        FEC: list[i].fec,
        isOffline: 0,
        safeId: 0, // applicationcontextten geliyor suan dolduramıyoruz.
        unitPrice: list[i].unitPrice,
        withDrawCount: list[i].withdrawalCount,
        banknoteName: list[i].name,
        transactionType: this.props.behaviourType == 'Deposit' ? 0 : 1
      });
    }
  }

  onFocus(e) {
    this.setState({ currencyOpacity: 1, caretPosition: 0, alignInputHintToRight:true});
    if (this.bInputNumeric.getValue() == 0)
      {this.setState({totalValue:' ', alignInputHintToRight:false}); }
    else
    this.setState({alignInputHintToRight:true});

    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  }

  onBlur(e) {
    var newValue = this.bInputNumeric.getValue();
    if (newValue==null || newValue == ' ' || newValue==0)
      this.setState({alignInputHintToRight:false});

    if (newValue) {
      this.setState({ currencyOpacity: 1 });
      let stringArray = newValue.toString().split(',');
      let stringArrayDot = newValue.toString().split('.');

      if (stringArray.length > 1 || stringArrayDot.length > 1) // virgüllü ise
      {
        let digits = stringArray[1].length > 0 ? stringArray[1] : stringArrayDot[1];
        if (digits.length == 1) {
          let valueToShow = BLocalization.formatCurrency(newValue + ',00');
          this.setState({inputValue:valueToShow}); // this.bInputNumeric.binput.getInstance().setValue(newValue + '0');
        }
        else if (digits.length == 0) {
          let valueToShow = BLocalization.formatCurrency(newValue + ',00');
          this.setState({inputValue:valueToShow});// this.bInputNumeric.binput.getInstance().setValue(newValue + '00');
        }
      }
      else {
        let valueToShow = BLocalization.formatCurrency(newValue + ',00');
        this.setState({inputValue:valueToShow}); // this.bInputNumeric.binput.getInstance().setValue(newValue + ',00');
      }
    }
    else {
      this.setState({ currencyOpacity: 0 });
    }

    if (this.banknoteEntered && newValue != this.oldTotalValue) {
      BDialogHelper.show(
        this.props.context,
        this.getMessage('BusinessComponents', 'EnteredBanknoteDetailsWillBeResetSure'), // Toplam değeri değiştirirseniz girilmiş küpür bilgileri silinecek. Devam etmek istiyor musunuz
        BComponent.DialogType.QUESTION,
        BComponent.DialogResponseStyle.YESCANCEL,
        null,
        this.getTotalValueResponse.bind(this)
      );
    }
    if (this.props.onBlur)
      this.props.onBlur(e);
  }

  handleOpen() {
    this.setState({ totalValue: this.bInputNumeric.getValue() }, this.showBanknoteDialog);
  }

  handleInfoClick(e) {
    if (this.props.onInfoButtonClick)
      this.props.onInfoButtonClick(e);
  }

  showBanknoteDialog() {
    const banknoteList = cloneDeep(this.state.banknoteList);

    let dialog =
      <BBanknoteDialog
        context={this.props.context}
        tellerProcessTypeInfo={this.tellerProcessTypeInfo}
        totalValue={this.state.totalValue}
        banknoteList={banknoteList}
        canChangeTotalValue={this.props.canChangeTotalValue}
        behaviourType={this.props.behaviourType}
        FECCode={this.FECCode}
        canEnterZeroValue={this.props.canEnterZeroValue}
        isVisibleChangeTotal={this.props.isVisibleChangeTotal}
        givenTotal={this.state.givenTotal}
        receivedTotal={this.state.receivedTotal}
        clippingAmount={this.state.totalValue}
        receivedChange={this.state.receivedChange}
        givenChange={this.state.givenChange}
              />;
    BDialogHelper.showWithResourceCode(this.props.context, '', dialog, 0, 0, this.getMessage('BusinessComponents', 'BanknoteResource'), this.handleClose.bind(this), { width: '570px', height: '80%' });
  }

  handleClose(dialogResponse, data) {
    if (dialogResponse == BComponent.DialogResponse.YES) {
      this.setState({
        inputValue:data.totalValue,
        totalValue: data.totalValue,
        banknoteList: data.banknoteList,
        value:data.totalValue,
        alignInputHintToRight: (data.totalValue>0 ? true:false),
        receivedTotal: data.receivedTotal,
        givenTotal: data.givenTotal,
        receivedChange: data.receivedChange,
        givenChange: data.givenChange,
        currencyOpacity : (data.totalValue>0 ? 1 : 0)},
        this.handleOnchange);
      this.oldTotalValue = data.totalValue;
      this.fillTellerTransactionList(data.banknoteList);
      this.givenTotal = data.givenTotal;
      this.receivedTotal = data.receivedTotal;
      this.banknoteEntered = true;
    }
  }

  handleOnchange()
  {
    if (this.props.onChange)
      this.props.onChange(this, this.state.totalValue);
  }

  handleInputChange(e, val)
  {
    this.setState({ inputValue: val, totalValue:val});

    // if (this.props.onChange)
      // this.props.onChange(this, this.state.totalValue);
    // let newValue= val; //BLocalization.formatCurrency(val);

    if (this.bInputNumeric.getValue() == 0 && !(e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105)) {
      // this.setState({ format: 'D', totalValue: ' ' });
      // this.props.onChange && this.props.onChange(this, this.state.totalValue);
    }
    else {
      this.props.onChange && this.props.onChange(this, val);
    }
  }

  resetValue() {
    this.bInputNumeric.resetValue();
    this.setState({ totalValue: this.props.totalValue, inputValue:'', alignInputHintToRight: false});
    if (this.props.totalValue)
      this.setState({ currencyOpacity: 1 });

    this.getFECBanknoteList(this.props.FEC);
    this.banknoteEntered = false;
  }

  getValue() {
    return {
      /* eslint-disable no-redeclare */
      value: this.bInputNumeric.getValue(),
      FEC: this.props.FEC,
      tellerTransactionList: this.getTellerTransactionListValue(),
      hasTellerProcessInfo: this.props.context.applicationContext.hasTellerProcessInfo // global yetkiye de bakılacak
      /* eslint-disable no-redeclare */
    };
  }

  setValue(value) {
    this.setState({ ...value });
  }

  getTellerTransactionListValue() {
    return this.tellerTransactionList.filter((teller) => {
      return teller.depositCount > 0 || teller.withDrawCount > 0;
    });
  }


  getSnapshot() {
    return { state: this.state };
  }

  setSnapshot(snapshot) {
    let { state } = snapshot;
    this.setState({ ...state });
  }

  setTotalValue(totalValue: number) {
    this.setState({ totalValue: totalValue, currencyOpacity: totalValue ? 1 : 0 });
  }

  setFEC(FEC: number) {
    this.getFECBanknoteList(FEC);
  }

  getTotalValueResponse(dialogResponse) {
    if (dialogResponse == BComponent.DialogResponse.YES) {
      this.banknoteEntered = false;
      this.oldTotalValue = this.bInputNumeric.getValue();
      this.setState({ totalValue: this.oldTotalValue });
      this.getFECBanknoteList(this.props.FEC);
    }
    else {
      this.setState({ totalValue: ' ' }, () => { this.setState({ totalValue: this.oldTotalValue }); });
    }
  }

  onKeyDown(e) {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }

    // this.setState({inputValue:this.state.inputValue});


  }

  render() {
    return (
      <div style={{ position: 'relative' }}>
        <BInputNumeric
          inputAlign={this.props.context.localization.isRightToLeft ? 'left' : (this.state.alignInputHintToRight)  ?  'right': 'left'}
          inputStyle={this.props.context.localization.isRightToLeft ? { marginLeft: '50px' } : { marginRight: '56px' }}
          ref={r => this.bInputNumeric = r}
          // value= {this.state.inputValue}
          value={ ((this.state.totalValue=='0' || this.state.totalValue==null) ? '': BLocalization.formatCurrency(this.state.totalValue) )}
          context={this.props.context}
          errorText={this.props.errorText}
          floatingLabelText={this.props.floatingLabelText}
          floatingLabelStyle = {this.state.alignInputHintToRight ? { marginRight:'40px'} : {marginLeft:'0px'}}
          maxLength={this.props.maxLength}
          onChange={this.handleInputChange.bind(this)}
          // onChange={this.handleInputChange.bind(this)}
          onFocus={this.onFocus.bind(this)}
          onBlur={this.onBlur}
        //  onKeyDown={this.onKeyDown.bind(this)}
          disabled={this.props.disabled || this.props.isReadOnly}
          format= 'M'
          defaultValue=''
        />
        {
          (this.props.showBankNoteButton) ?
            <div>
              {this.state.currencyOpacity == 1 ?
                <div style={{ marginBottom: '3px', position: 'absolute', color: this.props.context.theme.boaPalette.base400, bottom: '10px', right: !this.props.context.localization.isRightToLeft ? this.hintTextRight : 'auto', left: !this.props.context.localization.isRightToLeft ? 'auto' : this.hintTextRight, fontSize: '12px', opacity: 1 }}>
                  {this.FECCode}
                </div>
                :
                <div style={{ marginBottom: '3px', position: 'absolute', color: this.props.context.theme.boaPalette.base400, bottom: '10px', right: !this.props.context.localization.isRightToLeft ? this.hintTextRight : 'auto', left: !this.props.context.localization.isRightToLeft ? 'auto' : this.hintTextRight, fontSize: '12px', opacity: 0 }}>
                  {this.FECCode}
                </div>
              }
              {this.props.showInfoButton ?
                <div style={!this.props.context.localization.isRightToLeft ? { position: 'absolute', right: 32, bottom: '16px' } : { position: 'absolute', left: 32, bottom: '16px' }}>
                  {<BButton type="flat" colorType="primary"
                    context={this.props.context}
                    dynamicIcon="Info"
                    onClick={this.handleInfoClick.bind(this)}
                    style={{ minWidth: '24px', width: '24px', height: '24px', padding: '0px' }}
                    iconProperties={{ style: { display: 'flex' } }}
                    disabled={this.props.disabled || !this.props.isChoosable} />}
                </div> : <div />}
              <div style={{ position: 'absolute', right: !this.props.context.localization.isRightToLeft ? '0px' : 'auto', left: !this.props.context.localization.isRightToLeft ? 'auto' : '5px', bottom: '10px' }}>
                {<BButton type="flat" colorType="primary"
                  context={this.props.context}
                  dynamicIcon="BorderColor"
                  onClick={this.handleOpen.bind(this)}
                  style={{ minWidth: '24px', width: '24px', height: '24px', padding: '0px', paddingRight: '8px', paddingLeft: '8px', alignContent:'center', verticalAlign:'middle' }}
                  iconProperties={{ style: { display: 'flex' } }}
                  disabled={this.props.disabled || !this.props.isChoosable} />}
              </div>
            </div>

            :
            <div>
              {this.state.currencyOpacity == 1 ?
                <div style={{ position: 'absolute', color: this.props.context.theme.boaPalette.base350, bottom: '18px', right: !this.props.context.localization.isRightToLeft ? this.hintTextRight : 'auto', left: !this.props.context.localization.isRightToLeft ? 'auto' : this.hintTextRight, fontSize: '12px', opacity: 1 }}>
                  {this.FECCode}
                </div>
                :
                <div style={{ position: 'absolute', color: this.props.context.theme.boaPalette.base350, bottom: '18px', right: !this.props.context.localization.isRightToLeft ? this.hintTextRight : 'auto', left: !this.props.context.localization.isRightToLeft ? 'auto' : this.hintTextRight, fontSize: '12px', opacity: 0 }}>
                  {this.FECCode}
                </div>
              }
              {this.props.showInfoButton ?
                <div style={{ position: 'absolute', right: !this.props.context.localization.isRightToLeft ? '0px' : 'auto', left: !this.props.context.localization.isRightToLeft ? 'auto' : '0px', bottom: '10px' }}>
                  {<BButton type="flat" colorType="primary"
                    context={this.props.context}
                    dynamicIcon="Info"
                    onClick={this.handleInfoClick.bind(this)}
                    style={{ minWidth: '24px', width: '24px', height: '24px', padding: '0px' }}
                    iconProperties={{ style: { display: 'flex' } }}
                    disabled={this.props.disabled || !this.props.isChoosable} />}
                </div> : <div />}
            </div>
        }
      </div>
    );
  }
}


export default BMoney;
