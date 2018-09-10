import React from 'react';
var BAccessPointBrowser = require('b-access-point-browser').BAccessPointBrowser;
import styled from 'styled-components';
var BComboBox = require('b-combo-box').BComboBox;
import Paper from '@material-ui/core/Paper';
import { Tabs, Tab } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import BCheckBox from 'b-check-box';
import BInput from 'b-input';

export class BAccessPointBrowserTestGenerator {
  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
    self.state = {
      data: [],
      selectedTabIndex: 0,
      eventList: [],
      renderCount: 1,
      isChoosable: true,
      isMultiSelection: true,
      workgroupMustBeSelected: false,
      roleMustBeSelected: true,
      userMustBeSelected: false,
      selectedAccessPointIds: [236376, 236391]
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

  accessPointDialogClosedByApprove() {
    this.self.setState({
      renderCount: this.self.state.renderCount + 1,
      eventList: this.getEventList('accessPointDialogClosedByApprove()')
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
                <BAccessPointBrowser
                  context={context}
                  ref={r => (this.BBAccessPointBrowser = r)}
                  isMultiSelection={self.state.isMultiSelection}
                  workgroupMustBeSelected={self.state.workgroupMustBeSelected}
                  roleMustBeSelected={self.state.roleMustBeSelected}
                  userMustBeSelected={self.state.userMustBeSelected}
                  showDetailedAccessPointName={self.state.showDetailedAccessPointName}
                  isChoosable={self.state.isChoosable}
                  selectedAccessPointIds={self.state.selectedAccessPointIds}
                  accessPointDialogClosedByApprove={() => {
                    this.accessPointDialogClosedByApprove();
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
                        checked={self.state.isMultiSelection}
                        label={'isMultiSelection'}
                        onChange={(e, v) => {
                          this.self.setState({
                            isMultiSelection: v
                          });
                        }}
                      />
                      <br />
                      <BCheckBox
                        context={context}
                        checked={self.state.showDetailedAccessPointName}
                        label={'showDetailedAccessPointName'}
                        onChange={(e, v) => {
                          this.self.setState({
                            showDetailedAccessPointName: v
                          });
                        }}
                      />
                      <br />
                      <BCheckBox
                        context={context}
                        checked={self.state.isChoosable}
                        label={'isChoosable'}
                        onChange={(e, v) => {
                          this.self.setState({
                            isChoosable: v
                          });
                        }}
                      />
                      <br />
                      <BCheckBox
                        context={context}
                        checked={self.state.userMustBeSelected}
                        label={'userMustBeSelected'}
                        onChange={(e, v) => {
                          this.self.setState({
                            userMustBeSelected: v
                          });
                        }}
                      />
                      <br />
                      <BCheckBox
                        context={context}
                        checked={self.state.workgroupMustBeSelected}
                        label={'workgroupMustBeSelected'}
                        onChange={(e, v) => {
                          this.self.setState({
                            workgroupMustBeSelected: v
                          });
                        }}
                      />
                      <br />
                      <BCheckBox
                        context={context}
                        checked={self.state.roleMustBeSelected}
                        label={'roleMustBeSelected'}
                        onChange={(e, v) => {
                          this.self.setState({
                            roleMustBeSelected: v
                          });
                        }}
                      />
                      <br />
                      <BInput
                        context={context}
                        type="Text"
                        hintText="selectedAccessPointIds"
                        floatingLabelText="selectedAccessPointIds"
                        value={self.state.selectedAccessPointIds.toString()}
                        onChange={(e, v) => {
                          let ids = [];
                          v.split(',').forEach(id => {
                            ids.push(Number(id));
                          });
                          this.self.setState({
                            selectedAccessPointIds: ids
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

export default BAccessPointBrowserTestGenerator;
