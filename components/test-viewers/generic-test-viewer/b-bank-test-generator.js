import React from 'react';
var BBankComponent = require('b-bank-component').BBankComponent;
import styled from 'styled-components';
var BComboBox = require('b-combo-box').BComboBox;
import Paper from '@material-ui/core/Paper';
import {Tabs, Tab } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

export class BBankComponentTestGenerator {
  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
    self.state = {
      data: [],
      behaviourType: 3,
      selectedCityId: 34,
      selectedBranchId: 40,
      selectedBankId: 205,
      selectedTabIndex: 1,
      selectedBank: null,
      selectedBranch: null,
      selectedCity: null,
      eventList: []
    };
  }

  eventList = [];

  getEventList(eventName) {
    this.eventList.push(eventName);
    return this.eventList;
  }

  handleOnBankSelect(bank) {
    if (bank) {
      this.self.setState({
        selectedBankId: bank.bankId,
        selectedBank: bank,
        eventList: this.getEventList('onBankSelect(bank) => ' + bank.name)
      });
    } else {
      // Not burada tekrar selectedBankId=null set etmeyiniz!
      this.self.setState({
        selectedBank: bank,
        eventList: this.getEventList('onBankSelect(bank) => bulunmadı.')
      });
    }
  }

  handleOnCitySelect(city) {
    if (city) {
      this.self.setState({
        selectedCityId: city.cityId,
        selectedCity: city,
        eventList: this.getEventList('onCitySelect(city) => ' + city.name)
      });
    } else {
      // Not burada tekrar selectedCityId=null set etmeyiniz!
      this.self.setState({
        selectedCity: city,
        eventList: this.getEventList('onCitySelect(city) => ' + ('bulunmadı. (CityId:' + this.self.state.selectedCityId + ')'))
      });
    }
  }

  handleOnBranchSelect(branch) {
    if (branch) {
      this.self.setState({
        selectedBranchId: branch.extendedBranchId,
        selectedBranch: branch,
        eventList: this.getEventList('onBranchSelect(branch) => ' + branch.name)
      });
    } else {
      // Not burada tekrar selectedBranchId=null set etmeyiniz!
      this.self.setState({
        selectedBranch: branch,
        eventList: this.getEventList('onBranchSelect(branch) => bulunmadı. (BranchId:' + this.self.state.selectedBranchId + ')')
      });
    }
  }

  handleTabChange = (event, value) => {
    this.self.setState({ selectedTabIndex: value });
  };

  generate(context, self) {
    let behaviourTypes = [
      { text: '1 - Bank', value: 1 },
      { text: '2 - BankCity', value: 2 },
      { text: '3 - BankCityBranch', value: 3 },
      { text: '4 - BankBranch', value: 4 }
    ];

    let someCitys = [{ text: '1 - Adana', value: 1 }, { text: '12 - Bingöl', value: 12 }, { text: '34 - Istanbul', value: 34 }];
    let someBranch = [
      { text: '40 - Mecidiyeköy şubesi', value: 40 },
      { text: '46 - Bağcılar/İstanbul', value: 46 },
      { text: '285 - Barkal/Adana', value: 285 }
    ];

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
                      hintText="Behavior Type"
                      ref={r => (this.comboSingle = r)}
                      dataSource={behaviourTypes}
                      multiSelect={false}
                      multiColumn={false}
                      isAllOptionIncluded={false}
                      displayMemberPath="text"
                      valueMemberPath="value"
                      labelText="Behavior Type"
                      value={[self.state.behaviourType]}
                      onSelect={(index, selectedItems, selectedValues) => {
                        this.self.setState({
                          behaviourType: selectedValues[0],
                          selectedBank: null,
                          selectedBranch: null,
                          selectedCity: null
                        });
                      }}
                    />
                  </div>
                  <div className="col-xs-4">
                    <BComboBox
                      context={context}
                      hintText="Selected City"
                      ref={r => (this.comboSingles = r)}
                      dataSource={someCitys}
                      multiSelect={false}
                      multiColumn={false}
                      isAllOptionIncluded={false}
                      displayMemberPath="text"
                      valueMemberPath="value"
                      labelText="Selected City"
                      disabled={!(self.state.behaviourType === 2 || self.state.behaviourType === 3)}
                      value={[self.state.selectedCityId]}
                      onSelect={(index, selectedItems, selectedValues) => {
                        this.self.setState({
                          selectedCityId: selectedValues[0]
                        });
                      }}
                    />
                  </div>
                  <div className="col-xs-4">
                    <BComboBox
                      context={context}
                      hintText="Selected Branch"
                      ref={r => (this.comboSingles2 = r)}
                      dataSource={someBranch}
                      multiSelect={false}
                      multiColumn={false}
                      isAllOptionIncluded={false}
                      displayMemberPath="text"
                      valueMemberPath="value"
                      labelText="Selected Branch"
                      value={[self.state.selectedBranchId]}
                      disabled={!(self.state.behaviourType === 3 || self.state.behaviourType === 4)}
                      onSelect={(index, selectedItems, selectedValues) => {
                        this.self.setState({
                          selectedBranchId: selectedValues[0]
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-6">
                <br />
                <h4>Preeview</h4>
                <BBankComponent
                  context={context}
                  ref={r => (this.bankComponent = r)}
                  behaviourType={self.state.behaviourType}
                  selectedBankId={self.state.selectedBankId}
                  selectedCityId={self.state.selectedCityId}
                  selectedBranchId={self.state.selectedBranchId}
                  onBankSelect={bank => {
                    this.handleOnBankSelect(bank);
                  }}
                  onCitySelect={city => {
                    this.handleOnCitySelect(city);
                  }}
                  onBranchSelect={branch => {
                    this.handleOnBranchSelect(branch);
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
                    <Preview
                      selectedBank={self.state.selectedBank}
                      selectedCity={self.state.selectedCity}
                      selectedBranch={self.state.selectedBranch}
                    />
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
export default BBankComponentTestGenerator;

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
    selectedBank: props.selectedBank,
    selectedCity: props.selectedCity,
    selectedBranch: props.selectedBranch
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
