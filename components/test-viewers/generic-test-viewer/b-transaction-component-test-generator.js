import React from 'react';
var BTransactionComponent = require('b-transaction-component').BTransactionComponent;
import styled from 'styled-components';
var BComboBox = require('b-combo-box').BComboBox;
import Paper from '@material-ui/core/Paper';
import { Tabs, Tab } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import BCheckBox from 'b-check-box';
import BInput from 'b-input';

export class BTransactionComponentTestGenerator {
  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
    self.state = {
      data: [],
      selectedTabIndex: 0,
      selectedTransactions: [],
      eventList: [],
      renderCount: 1,
      canMultipleSelect: true,
      transactionCodeVisibility: true,
      selectedTransactionNodes: ['DFULIMIT', 'DFUINVOICE']
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

  onTransactionSelect(values) {
    this.self.setState({
      renderCount: this.self.state.renderCount + 1,
      selectedTransactions: values,
      eventList: this.getEventList('onTransactionSelect(values) => ' + values.length + ' item(s)')
    });
  }

  handleOnResetValue() {
    this.self.setState({
      renderCount: this.self.state.renderCount + 1,
      selectedTransactions: [],
      eventList: this.getEventList('onResetValue()')
    });
  }

  changePropCheckedState = key => event => {
    const checked = event.target.checked;
    this.self.setState({
      [key]: checked
    });
  };

  generate(context, self) {
    return [
      {
        text: 'BAccountComponent',
        component: (
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-6">
                <h4>Preeview</h4>
                <BTransactionComponent
                  context={context}
                  ref={r => (this.BTransactionComponent = r)}
                  labelText={'Transaction Component'}
                  hintText={'Selected Transactions'}
                  canMultipleSelect={self.state.canMultipleSelect}
                  showOnlyAuthorized={self.state.showOnlyAuthorized}
                  transactionCodeVisibility={self.state.transactionCodeVisibility}
                  selectedTransactionNodes={self.state.selectedTransactionNodes}
                  onTransactionSelect={selectedTransactions => {
                    this.onTransactionSelect(selectedTransactions);
                  }}
                  onResetValue={() => {
                    this.handleOnResetValue();
                  }}
                />
              </div>
              <div className="col-xs-6">
                <br />
                <Paper>
                  <Tabs value={self.state.selectedTabIndex} onChange={this.handleTabChange} indicatorColor="primary" textColor="primary">
                    <Tab label="Props" />
                    <Tab label="getValue()" />
                    <Tab label="Event Handler" />
                  </Tabs>
                </Paper>

                {self.state.selectedTabIndex === 0 && (
                  <Typography component="div">
                    <PreviewWrap>
                      <BCheckBox
                        context={context}
                        checked={self.state.canMultipleSelect}
                        label={'canMultipleSelect'}
                        onChange={(e, v) => {
                          this.self.setState({
                            canMultipleSelect: v
                          });
                        }}
                      />
                      <br />
                      <BCheckBox
                        context={context}
                        checked={self.state.showOnlyAuthorized}
                        label={'showOnlyAuthorized'}
                        onChange={(e, v) => {
                          this.self.setState({
                            showOnlyAuthorized: v
                          });
                        }}
                      />
                      <br />
                      <BCheckBox
                        context={context}
                        checked={self.state.transactionCodeVisibility}
                        label={'transactionCodeVisibility'}
                        onChange={(e, v) => {
                          this.self.setState({
                            transactionCodeVisibility: v
                          });
                        }}
                      />
                      <br />
                      <BInput
                        context={context}
                        type="Text"
                        hintText="selectedTransactionNodes"
                        floatingLabelText="selectedTransactionNodes => PropTypes.arrayOf(PropTypes.string)"
                        value={self.state.selectedTransactionNodes.toString()}
                        onChange={(e, v) => {
                          let codes = [];
                          v.split(',').forEach(code => {
                            codes.push(code);
                          });
                          this.self.setState({
                            selectedTransactionNodes: codes
                          });
                        }}
                      />
                    </PreviewWrap>
                  </Typography>
                )}
                {self.state.selectedTabIndex === 1 && (
                  <Typography component="div">
                    <Preview obj={self.state.selectedTransactions} />
                  </Typography>
                )}
                {self.state.selectedTabIndex === 2 && (
                  <Typography component="div">
                    <Preview obj={self.state.eventList} />
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

const Preview = props => {
  if (!props.obj) {
    return null;
  }
  const innerHTML = JSON.stringify(props.obj, null, 2)
    .replace(/\n/g, '<br>')
    .replace(/\s/g, '&nbsp;');

  return (
    <div>
      <PreviewContainer dangerouslySetInnerHTML={{ __html: innerHTML }} />
    </div>
  );
};

const PreviewWrap = props => {
  return (
    <div>
      <PreviewContainer>{props.children}</PreviewContainer>
    </div>
  );
};

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

export default BTransactionComponentTestGenerator;
