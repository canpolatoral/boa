import React from 'react';
var BResourceBrowser = require('b-resource-browser').BResourceBrowser;
import styled from 'styled-components';
var BComboBox = require('b-combo-box').BComboBox;
import Paper from '@material-ui/core/Paper';
import {Tabs, Tab } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

export class BResourceBrowserTestGenerator {
  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
    self.state = {
      data: [],
      selectedTabIndex: 0,
      selectedResourceList: [],
      selectedResourceData: [],
      eventList: [],
      renderCount: 1,
      actionListVisibility: true,
      canMultipleSelect: true
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

  handleOnResourceSelect(values, datas) {
    this.self.setState({
      renderCount: this.self.state.renderCount + 1,
      selectedResourceList: values,
      selectedResourceData: datas,
      eventList: this.getEventList('onResourceSelect(values, data) => ' + values.length + ' item(s)')
    });
  }

  handleOnResetValue() {
    this.self.setState({
      renderCount: this.self.state.renderCount + 1,
      selectedResourceList: [],
      selectedResourceData: [],
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
                <h4>Some Props</h4>
                <div className="row">
                  <div className="col-xs-4">
                    <div className="checkbox" style={{ margin: '5px 0' }}>
                      <label>
                        <input
                          type="checkbox"
                          name="actionListVisibility"
                          checked={self.state.actionListVisibility}
                          onChange={this.changePropCheckedState('actionListVisibility')}
                        />
                        Action List Visibility
                      </label>
                    </div>
                  </div>
                  <div className="col-xs-4">
                    <div className="checkbox" style={{ margin: '5px 0' }}>
                      <label>
                        <input
                          type="checkbox"
                          name="canMultipleSelect"
                          checked={self.state.canMultipleSelect}
                          onChange={this.changePropCheckedState('canMultipleSelect')}
                        />
                        Can Multiple Select
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-6">
                <br />
                <h4>Preeview</h4>
                <BResourceBrowser
                  context={context}
                  ref={r => (this.BResourceBrowser = r)}
                  labelText={'Resource Component'}
                  hintText={'Selected Resources'}
                  canMultipleSelect={self.state.canMultipleSelect}
                  actionListVisibility={self.state.actionListVisibility}
                  selectedResourceCode={self.state.selectedResourceCode}
                  // selectedResourceIdList={[182, 3021]}
                  onResourceSelect={(values, datas) => {
                    this.handleOnResourceSelect(values, datas);
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
                    <Tab label="getValue()" />
                    <Tab label="getData()" />
                    <Tab label="Event Handler" />
                  </Tabs>
                </Paper>

                {self.state.selectedTabIndex === 0 && (
                  <Typography component="div">
                    <Preview selectedResourceList={self.state.selectedResourceList} />
                  </Typography>
                )}
                {self.state.selectedTabIndex === 1 && (
                  <Typography component="div">
                    <DataPreview selectedResourceData={self.state.selectedResourceData} />
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

const Preview = props => {
  if (!props.selectedResourceList) {
    return null;
  }
  const innerHTML = JSON.stringify(props.selectedResourceList, null, 2)
    .replace(/\n/g, '<br>')
    .replace(/\s/g, '&nbsp;');

  return (
    <div>
      <PreviewContainer dangerouslySetInnerHTML={{ __html: innerHTML }} />
    </div>
  );
};

const DataPreview = props => {
  if (!props.selectedResourceData) {
    return null;
  }
  const innerHTML = JSON.stringify(props.selectedResourceData, null, 2)
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

export default BResourceBrowserTestGenerator;
