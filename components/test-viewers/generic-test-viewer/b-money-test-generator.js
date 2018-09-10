import React from 'react';
var BMoney = require('b-money').BMoney;
var BButton = require('b-button').BButton;
var BInputNumeric = require('b-input-numeric').BInputNumeric;
var BCustomerNote = require('b-customer-note-dialog').BCustomerNote;
var BDialogHelper = require('b-dialog-box').BDialogHelper;

import { BDevice } from 'b-device';

export class BMoneyTestGenerator {
  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
  //  this.self.state.FEC = 2;
  //  this.self.state.totalValue = 2;
  }
  onClick() {
    // var snap = this.getMoney.getSnapshot();
    // this.setMoney.setSnapshot(snap);

    //  this.self.setState({ FEC: this.BFec.getValue() });
    //   this.self.setState({ totalValue: 10 });
    this.getMoney.setTotalValue(88);
    this.getMoney.setFEC(8);

  }

  onClick2() {
    var devices = BDevice.getDeviceByFunctionality(this.self.props.context.applicationContext.availableDevices, 3);
    var promise = BDevice.numeratorOpen(devices);
    promise.done((response) => {
      console.log(response);
    }).fail((error) => {
      console.log(error);
    });
  }
  onChange(e, val) {

  }

  changefec() {
    
  }

  onInfoClick(e) {

    // test
  }
  onCustomerNoteClick() {
    let dialog = <BCustomerNote context={this.self.props.context}
      isNew={false}
      note={
      {
        id: 7772,
        accountNumber: '444',
        customerName: 'TEST'
      }
      } />;
    BDialogHelper.show(this.self.props.context, dialog, 0, 0, 'Müşteri Notları', this.customerNoteClosed.bind(this), { width: '35%', height: '65%' });
  }
  customerNoteClosed() {

  }
  generate(context, self) {
    return [
      {
        'text': 'setFEC',
        'component': 
  <div>
    <BInputNumeric context={context} ref={r => this.BFec = r} value={2} />
    <button onClick={this.changefec.bind(this)} > ChangeFec </button>
  </div>
      },
      {
        'text': 'getSnap',
        'component': <BMoney context={context}
          ref={r => this.getMoney = r}
          FEC={this.self.state.FEC}
          onChange={this.onChange.bind(this)}
          totalValue={this.self.state.totalValue} />
      },
      {
        'text': 'getSnap',
        'component': <BButton context={context} text="SET" onClick={this.onClick.bind(this)} type={'flat'} />
      },
      {
        'text': 'setSnap',
        'component': <BMoney context={context}
          ref={r => this.setMoney = r}
        />
      },
      {
        'text': 'Smatic',
        'component': <BButton context={context} text="TEST" onClick={this.onClick2.bind(this)} type={'flat'} />
      },
      {
        'text': 'show banknote and Info',
        'component': <BMoney context={context}
          showBankNoteButton={true} showInfoButton={true}
        />
      },
      {
        'text': 'show only info',
        'component': <BMoney context={context} onInfoButtonClick={this.onInfoClick.bind(this)}
          showBankNoteButton={false} showInfoButton={true}
        />
      },
      {
        'text': 'no buttons',
        'component': <BMoney context={context} onInfoButtonClick={this.onInfoClick.bind(this)}
          showBankNoteButton={false} showInfoButton={false}
        />
      }

      ,
      {
        'text': 'deposit',
        'component': <BMoney context={context}
          behaviourType='Deposit'
        />
      },
      {
        'text': 'deposit',
        'component': <BMoney context={context}
          behaviourType='Withdrawal'
        />
      },
      {
        'text': 'Customer Note',
        'component': <BButton context={context} text="SHOW" onClick={this.onCustomerNoteClick.bind(this)} type={'flat'} />
      }
    ];
  }
}
export default BMoneyTestGenerator;
