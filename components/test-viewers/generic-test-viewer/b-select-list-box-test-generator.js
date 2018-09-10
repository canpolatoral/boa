import React from 'react';
var BSelectListBox = require('b-select-list-box').BSelectListBox;
var BCheckBox =  require('b-check-box').BCheckBox;
var BButton = require('b-button').BButton;
var _rows = [];
for (var i = 0; i < 20; i += 1) {
  _rows.push({
    id: i,
    label: 'Text Value ' + i
  });
}

export class BSelectListBoxTestGenerator {
  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
    self.state.rows = _rows;
    self.state.disabled = false;
  }

  _onClick(event, checked)
  {
    this.self.setState({disabled:checked});
  }

  _onbClick()
  {
    var _rolList = this.self.state.rows;
    _rolList.forEach(function (data) {
      if (data.bComboboxIndex == 0)
      {
        data.isChecked = true;
      }
      
    });

    this.self.setState({rows:_rolList});
  }

  _onChange(checkedItemList) {
    var maindiv = document.getElementById('container');
    maindiv.innerHTML = null;
    checkedItemList.forEach(function (data) {
      var div = document.createElement('div');
      div.setAttribute('style', 'border-bottom: 1px solid black');
      div.innerHTML = 'id:' + data.id + ', label:' + data.label;
      maindiv.appendChild(div);
    });

   // this.self.comboSingle.get
  }

  generate(context, self) {
    return [
      {
        'text': 'Select Box List',
        'component': <div>
          <div style={{width: '300px' }}>
            <BSelectListBox
            ref={r => self.comboSingle = r}
            context={context}
            name= "BSelectList"
            dataSource={self.state.rows}
            hintText={'Ara'}
            defaultChecked={false}
            onChange = {this._onChange.bind(this)}
            disabled={this.self.state.disabled} />
          </div>
          <div id="container"></div>
          <div><BCheckBox 
          ref={r => self.checkBox = r}
           context={context}
           iconStyle={{ marginRight: '0' }}
          label='Aktif|pasif' onChange={this._onClick.bind(this)} /></div>
          <div><BButton 
           context={context}
           ref={(r) => this.BtnAddNew = r}
           type="raised"
           text="Add New"
           onClick={this._onbClick.bind(this)}/></div>
        </div>
      }
    ];
  }
}
export default BSelectListBoxTestGenerator;
