import React from 'react';
import BAccountNote from 'b-account-note-dialog';

export class BAccountNoteDialogTestGenerator {
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
      canMultipleSelect: false
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

  generate(context) {
    return [
      {
        text: 'BAccountComponent',
        component: (
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-9">
                <h4>Preeview</h4>
                <BAccountNote accountNumber={10417} context={context} ref={r => (this.BAccountNote = r)} />
              </div> 
            </div>
          </div>
        )
      }
    ];
  }
}

export default BAccountNoteDialogTestGenerator;
