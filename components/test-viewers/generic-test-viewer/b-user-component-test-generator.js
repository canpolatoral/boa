import React from 'react';
var BUserComponent = require('b-parameter-component').BUserComponent;
import styled from 'styled-components';
var BComboBox = require('b-combo-box').BComboBox;
import Paper from '@material-ui/core/Paper';
import {Tabs, Tab } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

export class BUserComponentTestGenerator {
  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
    self.state = {
      valueMemberPath: 'userId',
      valueMemberPathUnit: 'userId',
      boaUserList: [],
      userIdTitle: 'userIdTitle',
      userCodeTitle: 'userCodeTitle',
      nameTitle: 'nameTitle',
      selectedUser: [],
      selectedUserId: this.props.selectedUserId,
      selectedUserCode: this.props.selectedUserCode
    };
  }

  eventList = [];

  getEventList(eventName) {
    this.eventList.push(eventName);
    return this.eventList;
  }

  handleOnParameterSelect(parameter) {
    if (parameter) {
      this.self.setState({
        selectedParamCode: parameter.paramCode,
        selectedParameter: parameter,
        eventList: this.getEventList('onParameterSelect(parameter) => ' + parameter.paramDescription)
      });
    } else {
      // Not burada tekrar selectedBankId=null set etmeyiniz!
      this.self.setState({
        selectedParameter: parameter,
        eventList: this.getEventList('onParameterSelect(parameter) => bulunmadı.')
      });
    }
  }

  changePropCheckedState = key => event => {
    const checked = event.target.checked;
    this.self.setState({
      [key]: checked
    });
  };

  handleTabChange = (event, value) => {
    this.self.setState({ selectedTabIndex: value });
  };

  generate(context, self) {
    let sortOption = [
      { text: '1 - Code', value: 1 },
      { text: '2 - name', value: 2 },
    ];

    let someParamTypes = [
      { text: 'ULKE', value: 'ULKE' },
      { text: 'LIMITSTATE', value: 'LIMITSTATE' },
      { text: 'CEKKARNE, DBTCMPMCC', value: 'CEKKARNE, DBTCMPMCC' }
    ];
    let someParams = [{ text: '1 - Türkiye', value: 1 }, { text: '43 - Portekiz', value: 43 }, { text: '49 - Romanya', value: 49 }];

    return [
      {
        text: 'BBankComponent',
        component: (
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-6">
                <h4>Some Props</h4>
                <div className="row">
                  <div className="col-xs-4">
                    <BComboBox
                      context={context}
                      hintText="Param Type"
                      ref={r => (this.comboSingles2ss = r)}
                      dataSource={someParamTypes}
                      multiSelect={false}
                      multiColumn={false}
                      isAllOptionIncluded={false}
                      displayMemberPath="text"
                      valueMemberPath="value"
                      labelText="Param Type"
                      value={[self.state.paramType]}
                      onSelect={(index, selectedItems, selectedValues) => {
                        let selectedValue = selectedValues[0];
                        let paramTypeList = [];
                        if (selectedValue.includes(',')) {
                          paramTypeList = selectedValue.split(',').map(item => {
                            return item.trim();
                          });
                        }

                        this.self.setState({
                          paramType: selectedValue,
                          paramTypeList: paramTypeList
                        });
                      }}
                    />
                  </div>
                  <div className="col-xs-4">
                    <BComboBox
                      context={context}
                      hintText="Selected Parameter"
                      ref={r => (this.comboSingles2 = r)}
                      dataSource={someParams}
                      multiSelect={false}
                      multiColumn={false}
                      isAllOptionIncluded={false}
                      displayMemberPath="text"
                      valueMemberPath="value"
                      labelText="Selected Parameter"
                      value={[self.state.selectedParamCode]}
                      onSelect={(index, selectedItems, selectedValues) => {
                        this.self.setState({
                          selectedParamCode: selectedValues[0]
                        });
                      }}
                    />
                  </div>
                  <div className="col-xs-4">
                    <BComboBox
                      context={context}
                      hintText="Sort Option"
                      labelText="Sort Option"
                      ref={r => (this.comboSingle = r)}
                      dataSource={sortOption}
                      multiSelect={false}
                      multiColumn={false}
                      isAllOptionIncluded={false}
                      displayMemberPath="text"
                      valueMemberPath="value"
                      value={[self.state.sortOption]}
                      onSelect={(index, selectedItems, selectedValues) => {
                        this.self.setState({
                          sortOption: selectedValues[0],
                          selectedBank: null,
                          selectedBranch: null,
                          selectedCity: null
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-4">
                    <div className="checkbox" style={{ margin: '5px 0' }}>
                      <label>
                        <input
                          type="checkbox"
                          name="isAllOptionIncluded"
                          checked={self.state.isAllOptionIncluded}
                          onChange={this.changePropCheckedState('isAllOptionIncluded')}
                        />
                        Is All Option Included
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
                <BUserComponent
                  context={context}
                  ref={r => (this.bankComponent = r)}
                  sortOption={self.state.sortOption}
                  selectedParamCode={self.state.selectedParamCode}
                  isAllOptionIncluded={self.state.isAllOptionIncluded}
                  paramType={self.state.paramType}
                  paramTypeList={self.state.paramTypeList}
                  onParameterSelect={parameter => {
                    this.handleOnParameterSelect(parameter);
                  }}
                />
              </div>
              <div className="col-xs-6">
                <br />

                <Paper>
                  <Tabs value={self.state.selectedTabIndex} onChange={this.handleTabChange} indicatorColor="primary" textColor="primary">
                    <Tab label="Selected Info" />
                    <Tab label="Event Handler" />
                  </Tabs>
                </Paper>

                {self.state.selectedTabIndex === 0 && (
                  <Typography component="div">
                    <Preview selectedParameter={self.state.selectedParameter} />
                  </Typography>
                )}
                {self.state.selectedTabIndex === 1 && (
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
export default BUserComponentTestGenerator;

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

const Preview = props => {
  const o = {
    selectedParameter: props.selectedParameter
  };

  const innerHTML = JSON.stringify(o, null, 2)
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
