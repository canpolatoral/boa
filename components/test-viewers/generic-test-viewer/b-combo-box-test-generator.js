import React from 'react';
import { findDOMNode } from 'react-dom';
var BComboBox = require('b-combo-box').BComboBox;

// helper to generate a random date
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString();
}

var priorities = ['Critical', 'High', 'Medium', 'Low'];
var issues = ['Bug', 'Improvement', 'Epic', 'Story'];
var _rows = [];
for (var i = 0; i < 20; i += 1) {
  _rows.push({
    value: i,
    text: 'Text Value ' + i,
    priority: priorities[Math.floor((Math.random() * priorities.length))],
    complete: Math.round(Math.random() * 100),
    issueType: issues[Math.floor((Math.random() * issues.length))],
    startDate: randomDate(new Date(2015, 3, 1), new Date()),
    completeDate: randomDate(new Date(), new Date(2016, 0, 1))
  });
}

var columns = [
  { key: 'value', name: 'Value', type: 'number', 'width': 80 },
  { key: 'text', name: 'Text', 'width': 140 },
  { key: 'priority', name: 'Priority', 'width': 60 },
  /*  { key: 'issueType', name: 'Issue Type', width: 180 },
   { key: 'complete', name: '% Complete', width: 180 },
   { key: 'startDate', name: 'Start Date', width: 180 },
   { key: 'completeDate', name: 'Expected Complete', width: 180 } */
];

export class BComboBoxTestGenerator {
  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }

    self.state.txt = 'boş text';
    self.state.selectedRows = 0;
    self.state.value = [0, 1];
    self.state.selectedValue = [];
    self.state.selectedItems = [];
    self.state.rows = _rows;
    this.disabled = false;
  }

  _onSelect(index, items, values) {
    this.debugLog('b-combobox test > onSelect called.');

    findDOMNode(this.selectedIndexes).innerText = index;
    findDOMNode(this.selectedItems2).innerHTML = items;
    findDOMNode(this.selectedValues2).innerText = values;

    findDOMNode(this.selectedItems2).innerHTML = null;
    var maindiv = document.createElement('div');
    items.forEach(function (data) {
      var div = document.createElement('div');
      div.setAttribute('style', 'border:1px solid black');
      div.innerHTML = data.value + ' ' + data.text + ' ' + data.priority + ' ' + data.issueType + ' ' + data.complete + ' ' + data.startDate + ' ' + data.completeDate;
      maindiv.appendChild(div);
    });
    findDOMNode(this.selectedItems2).appendChild(maindiv);

    this.debugLog(index);
    this.debugLog(items);
    this.debugLog(values);

  }

  _onSelect2(index, items, values) {
    this.debugLog('b-combobox test > onSelect2 called.');

    findDOMNode(this.selectedIndexes2).innerText = index;
    findDOMNode(this.selectedItems4).innerHTML = items;
    findDOMNode(this.selectedValues4).innerText = values;

    findDOMNode(this.selectedItems4).innerHTML = null;
    var maindiv = document.createElement('div');
    items.forEach(function (data) {
      var div = document.createElement('div');
      div.setAttribute('style', 'border:1px solid black');
      div.innerHTML = data.value + ' ' + data.text + ' ' + data.priority + ' ' + data.issueType + ' ' + data.complete + ' ' + data.startDate + ' ' + data.completeDate;
      maindiv.appendChild(div);
    });
    findDOMNode(this.selectedItems4).appendChild(maindiv);

    this.debugLog(index);
    this.debugLog(items);
    this.debugLog(values);
  }

  _changeTxt() {
    this.setState({ txt: 'değişti', value: [20, 30], selectedRows: 0, selectedValue: [], selectedItems: [], row: _rows });
  }

  _changeTxt2() {
    this.setState({ txt: 'değişti 2', value: [20, 30], selectedRows: 0, selectedValue: [], selectedItems: [], row: _rows });
  }

  _setNull() {
    this.setState({ value: null, selectedRows: 0, selectedValue: [], selectedItems: [], row: _rows });
  }

  _setNull2() {
    this.combo2.resetValue();
    // this.setState({  value: null, selectedRows: 0, selectedValue: [], selectedItems: [], row: _rows });
  }

  _buttonOnClick() {
    var getValues = this.combo.getValue().value;
    this.debugLog('getValues:');
    this.debugLog(getValues);
    // this.setState({selectedValue: getValues });

    var getItems = this.combo.getSelectedItems();
    this.debugLog('getItems:');
    this.debugLog(getItems);

    // this.setState({selectedItems: getItems });

    findDOMNode(this.selectedValues).innerText = getValues;

    findDOMNode(this.selectedItems).innerHTML = null;
    var maindiv = document.createElement('div');
    getItems.forEach(function (data) {
      var div = document.createElement('div');
      div.setAttribute('style', 'border:1px solid black');
      div.innerHTML = data.value + ' ' + data.text + ' ' + data.priority + ' ' + data.issueType + ' ' + data.complete + ' ' + data.startDate + ' ' + data.completeDate;
      maindiv.appendChild(div);
    });
    findDOMNode(this.selectedItems).appendChild(maindiv);
    // findDOMNode(this.selectedItems).innerText = getItems;
  }

  _buttonOnClick2() {
    var getValues = this.combo2.getValue().value;
    this.debugLog('getValues:');
    this.debugLog(getValues);
    // this.setState({selectedValue: getValues });

    var getItems = this.combo2.getSelectedItems();
    this.debugLog('getItems:');
    this.debugLog(getItems);

    // this.setState({selectedItems: getItems });

    findDOMNode(this.selectedValues3).innerText = getValues;

    findDOMNode(this.selectedItems3).innerHTML = null;
    var maindiv = document.createElement('div');
    getItems && getItems.forEach(function (data) {
      var div = document.createElement('div');
      div.setAttribute('style', 'border:1px solid black');
      div.innerHTML = data.value + ' ' + data.text + ' ' + data.priority + ' ' + data.issueType + ' ' + data.complete + ' ' + data.startDate + ' ' + data.completeDate;
      maindiv.appendChild(div);
    });
    findDOMNode(this.selectedItems3).appendChild(maindiv);
    // findDOMNode(this.selectedItems).innerText = getItems;
  }

  _btnDisableOnclick(e) {
    this.disabled = !this.disabled;
    this.self.combo.setDisable(this.disabled);
  }

  _btnValidateConstraintOnclick() {
    this.self.comboConstraint.validateConstraint();
  }

  _btnDisableOnclick2(e) {
    this.disabled = !this.disabled;
    this.self.combo2.setDisable(this.disabled);
  }

  generate(context, self) {
    return [
      {
        'text': 'Standard Single Select',
        'component': <div>
          <div style={{ marginBottom: '10px', width: '200px' }}>
            <BComboBox context={context}
              hintText= 'Hint Text'
              ref={r => self.comboSingle = r}
              // dataSource={[]}
              dataSource={self.state.rows}
              columns={columns}
              disabled={this.disabled}
              valueConstraint={{ required: true }}
              multiSelect={false}
              multiColumn={false}
              isAllOptionIncluded={false}
              displayMemberPath='text'
              valueMemberPath='value'
              labelText={self.state.txt}
              value={self.state.value}
            />
          </div>
        </div>
      },
      {
        'text': 'Standard Single Select-Disable Search',
        'component': <div>
          <div style={{ marginBottom: '10px', width: '200px' }}>
            <BComboBox context={context}
              hintText= 'Hint Text'
              ref={r => self.comboSingle = r}
              dataSource={self.state.rows}
              columns={columns}
              disabled={this.disabled}
              valueConstraint={{ required: true }}
              multiSelect={false}
              multiColumn={false}
              isAllOptionIncluded={false}
              displayMemberPath='text'
              valueMemberPath='value'
              labelText={self.state.txt}
              value={self.state.value}
              disableSearch={true}
            />
          </div>
        </div>
      },
      {
        'text': ' Standard Multi Select',
        'component': <div>
          <div style={{ marginBottom: '10px', width: '200px' }}>
            <BComboBox context={context}
              ref={r => self.combo = r}
              dataSource={self.state.rows}
              columns={columns}
              disabled={this.disabled}
              multiSelect={true}
              multiColumn={false}
              onSelect={this._onSelect.bind(self)}
              isAllOptionIncluded={false}
              displayMemberPath='text'
              valueMemberPath='value'
              labelText={self.state.txt}
              hintText= 'Hint Text'
              value={self.state.value}
            />
          </div>
          <div>
            <button id="disable" onClick={this._btnDisableOnclick.bind(this)} style={{ marginLeft: '10px' }}>Disable/Editable</button>
          </div>
          <div>
            <button onClick={this._buttonOnClick.bind(self)}>Get Selected Values/Items</button>
          </div>
          <div>
            Selected Values:<span ref={r => self.selectedValues = r}></span><br />
            Selected Items: <span ref={r => self.selectedItems = r}></span>
          </div>
          <div>
            <b>Fires when selected item(s) changed (OnSelect Event)</b><br />
            index:          <span ref={r => self.selectedIndexes = r}></span><br />
            selectedValues: <span ref={r => self.selectedValues2 = r}></span><br />
            selectedItems:  <span ref={r => self.selectedItems2 = r}> </span><br />
          </div>
          <div>
            <button onClick={this._changeTxt.bind(self)}>Change Property</button> | <button onClick={this._setNull.bind(self)}>Set Null as Value</button>
          </div>
        </div>
      },

      {
        'text': ' Standard Multi Select -DisableSearch',
        'component': <div>
          <div style={{ marginBottom: '10px', width: '200px' }}>
            <BComboBox context={context}
              ref={r => self.combo = r}
              dataSource={self.state.rows}
              columns={columns}
              disabled={this.disabled}
              multiSelect={true}
              multiColumn={false}
              onSelect={this._onSelect.bind(self)}
              isAllOptionIncluded={false}
              displayMemberPath='text'
              valueMemberPath='value'
              labelText={self.state.txt}
              hintText= 'Hint Text'
              value={self.state.value}
              disableSearch={true}
            />
          </div>
          <div>
            <button id="disable" onClick={this._btnDisableOnclick.bind(this)} style={{ marginLeft: '10px' }}>Disable/Editable</button>
          </div>
          <div>
            <button onClick={this._buttonOnClick.bind(self)}>Get Selected Values/Items</button>
          </div>
          <div>
            Selected Values:<span ref={r => self.selectedValues = r}></span><br />
            Selected Items: <span ref={r => self.selectedItems = r}></span>
          </div>
          <div>
            <b>Fires when selected item(s) changed (OnSelect Event)</b><br />
            index:          <span ref={r => self.selectedIndexes = r}></span><br />
            selectedValues: <span ref={r => self.selectedValues2 = r}></span><br />
            selectedItems:  <span ref={r => self.selectedItems2 = r}> </span><br />
          </div>
          <div>
            <button onClick={this._changeTxt.bind(self)}>Change Property</button> | <button onClick={this._setNull.bind(self)}>Set Null as Value</button>
          </div>
        </div>
      },
      {
        'text': 'Value Constraint',
        'component': <div>
          <div style={{ marginBottom: '10px', width: '200px' }}>
            <BComboBox context={context}
              ref={r => self.comboConstraint = r}
              dataSource={self.state.rows}
              columns={columns}
              disabled={this.disabled}
              valueConstraint={{ required: true }}
              multiSelect={false}
              multiColumn={true}
              isAllOptionIncluded={false}
              displayMemberPath='text'
              valueMemberPath='value'
              hintText= 'Hint Text'
              labelText={self.state.txt}
              value={self.state.value}
            />
          </div>
          <div>
            <button id="valueConstraint" onClick={this._btnValidateConstraintOnclick.bind(this)} style={{ marginLeft: '10px' }}>Value Constraint</button>
          </div>
        </div>
      },
      {
        'text': 'With CheckBox',
        'component': <div>
          <div style={{ marginBottom: '10px', width: '200px' }}>
            <BComboBox context={context}
              ref={r => self.combo2 = r}
              dataSource={self.state.rows}
              columns={columns}
              disabled={this.disabled}
              multiSelect={true}
              multiColumn={true}
              onSelect={this._onSelect2.bind(self)}
              isAllOptionIncluded={false}
              displayMemberPath='text'
              valueMemberPath='value'
              hintText= 'Hint Text'
              labelText={self.state.txt}
              value={self.state.value}
              showCheckBox={true}
            />
          </div>
          <div>
            <button id="disable2" onClick={this._btnDisableOnclick2.bind(this)} style={{ marginLeft: '10px' }}>Disable/Editable</button>
          </div>
          <div>
            <button onClick={this._buttonOnClick2.bind(self)}>Get Selected Values/Items</button>
          </div>
          <div>
            Selected Values:<span ref={r => self.selectedValues3 = r}></span><br />
            Selected Items: <span ref={r => self.selectedItems3 = r}></span>
          </div>
          <div>
            <b>Fires when selected item(s) changed (OnSelect Event)</b><br />
            index:          <span ref={r => self.selectedIndexes2 = r}></span><br />
            selectedValues: <span ref={r => self.selectedValues4 = r}></span><br />
            selectedItems:  <span ref={r => self.selectedItems4 = r}> </span><br />
          </div>
          <div>
            <button onClick={this._changeTxt2.bind(self)}>Change Property</button> | <button onClick={this._setNull2.bind(self)}>Set Null as Value</button>
          </div>
        </div>
      }
    ];
  }
}
export default BComboBoxTestGenerator;
