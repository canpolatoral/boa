import React from 'react';
var BAccountComponent = require('b-account-component').BAccountComponent;
import styled from 'styled-components';
import {Tabs, Tab, Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

export class BAccountComponentTestGenerator {
  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
    self.state = {
      data: [],
      selectedTabIndex: 0,
      selectedAccount: null,
      selectedCustomer: null,
      eventList: [],
      renderCount: 1
    };
  }

  eventList = [];

  getEventList(eventName) {
    this.eventList.push(eventName);
    return this.eventList;
  }

  handleTabChange = (event, value) => {
    this.self.setState({ selectedTabIndex: value });
  };

  handleOnCustomerSelect(customerInfo) {
    this.self.setState({
      selectedCustomer: customerInfo,
      eventList: this.getEventList(
        'onCustomerSelect(customerInfo) => ' +
          (customerInfo &&
            customerInfo.customerInfo &&
            customerInfo.customerInfo.customerid + '-' + customerInfo.customerInfo.customerName)
      )
    });
  }

  handleOnAccountSelect(account) {
    this.self.setState({
      selectedAccount: account,
      eventList: this.getEventList('onAccountSelect(account) => ' + (account && account.accountSuffix))
    });
  }

  handleOnCustomerNotFound() {
    this.self.setState({
      renderCount: this.self.state.renderCount + 1,
      selectedAccount: null,
      selectedCustomer: null,
      eventList: this.getEventList('onCustomerNotFound()')
    });
  }

  generate(context, self) {
    return [
      {
        text: 'BAccountComponent',
        component: (
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-6">
                {/* <h4>Some Props</h4> */}
                <div className="row">
                  <div className="col-xs-4" />
                  <div className="col-xs-4" />
                  <div className="col-xs-4" />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-6">
                <h4>Preeview</h4>
                <BAccountComponent
                  context={context}
                  ref={r => (this.bankComponent = r)}
                  behaviourType={self.state.behaviourType}
                  selectedBankId={self.state.selectedBankId}
                  selectedCityId={self.state.selectedCityId}
                  selectedBranchId={self.state.selectedBranchId}
                  onCustomerSelect={customerInfo => {
                    this.handleOnCustomerSelect(customerInfo);
                  }}
                  onCustomerNotFound={() => {
                    this.handleOnCustomerNotFound();
                  }}
                  onAccountSelect={account => {
                    this.handleOnAccountSelect(account);
                  }}
                />
              </div>
              <div className="col-xs-6">
                <br />

                <Paper>
                  <Tabs value={self.state.selectedTabIndex} onChange={this.handleTabChange} indicatorColor="primary" textColor="primary">
                    <Tab label="Selected Customer" />
                    <Tab label="Selected Account" />
                    <Tab label="Event Handler" />
                  </Tabs>
                </Paper>

                {self.state.selectedTabIndex === 0 && (
                  <Typography component="div">
                    <CustomerPreview selectedCustomer={self.state.selectedCustomer} />
                  </Typography>
                )}
                {self.state.selectedTabIndex === 1 && (
                  <Typography component="div">
                    <AccountPreview selectedAccount={self.state.selectedAccount} />
                  </Typography>
                )}
                {self.state.selectedTabIndex === 2 && (
                  <Typography component="div">
                    <EventPreview eventList={self.state.eventList} />
                  </Typography>
                )}
              </div>
            </div>
          </div>
        )
      }
    ];
  }
}
export default BAccountComponentTestGenerator;

const PreviewContainer = styled.pre`
  font-family: Consolas;
  font-size: 14px;
  font-weight: bold;
  white-space: pre-wrap;
  border: solid 1px #ccc;
  color: #9197a3;
  padding: 20px;
  min-height: 400px;
`;

const CustomerPreview = props => {
  const innerHTML = JSON.stringify(props.selectedCustomer, null, 2)
    .replace(/\n/g, '<br>')
    .replace(/\s/g, '&nbsp;');

  return (
    <div>
      <PreviewContainer dangerouslySetInnerHTML={{ __html: innerHTML }} />
    </div>
  );
};

const AccountPreview = props => {
  const innerHTML = JSON.stringify(props.selectedAccount, null, 2)
    .replace(/\n/g, '<br>')
    .replace(/\s/g, '&nbsp;');

  return (
    <div>
      <PreviewContainer dangerouslySetInnerHTML={{ __html: innerHTML }} />
    </div>
  );
};

const EventPreview = props => {
  const innerHTML = JSON.stringify(props.eventList, null, 2)
    .replace(/\n/g, '<br>')
    .replace(/\s/g, '&nbsp;');

  return (
    <div>
      <PreviewContainer dangerouslySetInnerHTML={{ __html: innerHTML }} />
    </div>
  );
};
