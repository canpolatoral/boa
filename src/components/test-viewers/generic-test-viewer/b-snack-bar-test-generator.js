import React from 'react';
import styled from 'styled-components';
import BComboBox from 'b-combo-box';
import BSnackBar from 'b-snackbar';
import Typography from '@material-ui/core/Typography';
import BButton from 'b-button';
import BInput from 'b-input';
import BInputNumeric from 'b-input-numeric';
import BCheckBox from 'b-check-box';

export class BParameterComponentTestGenerator {
  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
    self.state = {
      text: 'I love snackbar. \nThis is newline.',
      type: 'default',
      vertical: 'bottom',
      horizontal: 'left',
      showCloseIcon: true,
      closeText: 'Hello',
      timeout: 5000
    };
  }

  eventList = [];

  getEventList(eventName) {
    this.eventList.push(eventName);
    return this.eventList;
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

  closeCallback() {
    alert(this.self.state.text);
  }

  generate(context, self) {
    let types = [
      { text: 'default', value: 'default' },
      { text: 'success', value: 'success' },
      { text: 'error', value: 'error' },
      { text: 'info', value: 'info' },
      { text: 'warning', value: 'warning' }
    ];

    let vertical = [{ text: 'top', value: 'top' }, { text: 'bottom', value: 'bottom' }];
    let horizontal = [{ text: 'left', value: 'left' }, { text: 'right', value: 'right' }];

    let snackBar = (
      <BSnackBar
        ref={r => (this.bsnackBar = r)}
        context={context}
        messageId={'message_id' + new Date().getTime()}
        text={self.state.text}
        closeText={self.state.closeText}
        vertical={self.state.vertical}
        horizontal={self.state.horizontal}
        showCloseIcon={self.state.showCloseIcon}
        timeout={self.state.timeout}
        closeCallback={self.state.useCloseCallback && this.closeCallback.bind(this)}
        type={self.state.type}
        timeout={self.state.timeout}
      />
    );

    return [
      {
        text: 'BSnackBar',
        component: (
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-7">
                <h4>Play With Props</h4>
                <div className="row">
                  <div className="col-xs-12">
                    <BInput
                      context={context}
                      multiLine={true}
                      rows={2}
                      rowsMax={10}
                      type="Text"
                      hintText="Text"
                      floatingLabelText="Text"
                      value={self.state.text}
                      onChange={(e, v) => {
                        this.self.setState({
                          text: v
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-4">
                    <BComboBox
                      context={context}
                      hintText="Type"
                      labelText="Type"
                      dataSource={types}
                      multiSelect={false}
                      multiColumn={false}
                      isAllOptionIncluded={false}
                      displayMemberPath="text"
                      valueMemberPath="value"
                      value={[self.state.type]}
                      onSelect={(index, selectedItems, selectedValues) => {
                        let selectedValue = selectedValues[0];
                        this.self.setState({
                          type: selectedValue
                        });
                      }}
                    />
                  </div>
                  <div className="col-xs-4">
                    <BComboBox
                      context={context}
                      hintText="Vertical"
                      labelText="Vertical"
                      dataSource={vertical}
                      multiSelect={false}
                      multiColumn={false}
                      isAllOptionIncluded={false}
                      displayMemberPath="text"
                      valueMemberPath="value"
                      value={[self.state.vertical]}
                      onSelect={(index, selectedItems, selectedValues) => {
                        this.self.setState({
                          vertical: selectedValues[0]
                        });
                      }}
                    />
                  </div>
                  <div className="col-xs-4">
                    <BComboBox
                      context={context}
                      hintText="Horizontal"
                      labelText="Horizontal"
                      dataSource={horizontal}
                      multiSelect={false}
                      multiColumn={false}
                      isAllOptionIncluded={false}
                      displayMemberPath="text"
                      valueMemberPath="value"
                      value={[self.state.horizontal]}
                      onSelect={(index, selectedItems, selectedValues) => {
                        this.self.setState({
                          horizontal: selectedValues[0]
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-4">
                    <BInputNumeric
                      context={context}
                      hintText="Timeout"
                      floatingLabelText="Timeout"
                      value={self.state.timeout}
                      onChange={(e, v) => {
                        this.self.setState({
                          timeout: v
                        });
                      }}
                    />
                  </div>
                  <div className="col-xs-4">
                    <BCheckBox
                      context={context}
                      checked={self.state.showCloseIcon}
                      label={'Show Close Icon'}
                      onChange={(e, v) => {
                        this.self.setState({
                          showCloseIcon: v
                        });
                      }}
                    />
                  </div>
                  <div className="col-xs-4">
                    <BCheckBox
                      context={context}
                      checked={self.state.useCloseCallback}
                      label={'Use closeCallback event'}
                      onChange={(e, v) => {
                        this.self.setState({
                          useCloseCallback: v
                        });
                      }}
                    />
                    {self.state.useCloseCallback && (
                      <BInput
                        context={context}
                        type="text"
                        hintText="Close Text"
                        floatingLabelText="Close Text"
                        value={self.state.closeText}
                        onChange={(e, v) => {
                          this.self.setState({
                            closeText: v
                          });
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-12">
                    <br /> <br />
                    <BButton
                      type={'raised'}
                      color={'primary'}
                      text={'Show'}
                      style={{ marginRight: '10px' }}
                      onClick={e => {
                        this.bsnackBar.getInstance().show();
                      }}
                    />
                    <BButton
                      type={'raised'}
                      onClick={e => {
                        this.bsnackBar.getInstance().close();
                      }}
                      text={'Close'}
                    />
                  </div>
                </div>
              </div>
              <div className="col-xs-5">
                {snackBar}
              </div>
            </div>
          </div>
        )
      }
    ];
  }
}
export default BParameterComponentTestGenerator;
