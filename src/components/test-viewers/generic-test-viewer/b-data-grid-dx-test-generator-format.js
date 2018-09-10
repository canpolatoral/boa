import React from 'react';
import BDataGrid from 'b-data-grid-dx';
// import BDataGrid from './../../../components/ui/grid/b-data-grid-copy/index';
var mockData = require('./mock/mock-datagrid-dx-full.json');
import { BCard } from 'b-card';

export class BDataGridTestGenerator {

  initialize(self) {


    mockData=JSON.parse(JSON.stringify(mockData));

    let mockData2=mockData.slice(0, 500);

    mockData2.forEach((element)=>{
      element.image1=null;
    });
    mockData2[0].iban='TR330006100519786457841326'
    mockData2[0].telephone='+905073850654'


    this.self = self;
    if (!self.state) {
      self.state = {
        columns:[
          { name: 'fullname', title: 'Name' },
          { name: 'date1', title: 'Date -L', type: 'date'}, // default 'L'
          { name: 'date2', title: 'Date -LL', type: 'date', dateFormat:'LL'},
          { name: 'date3', title: 'Date -LLL', type: 'date', dateFormat:'LLL'},
          { key: 'date4', name: 'Date -LT', type: 'date', dateFormat:'LT' },
          { name: 'balance1', title: 'Decimal-F', type: 'decimal', numberFormat:'F' },
          { name: 'balance2', title: 'Decimal-M', type: 'decimal', numberFormat:'M' },
          { name: 'balance3', title: 'Decimal-FX', type: 'decimal', numberFormat:'FX' },
          { name: 'number1', title: 'Number-D', type: 'number', numberFormat:'D' },
          { name: 'model', title: 'Number-F', type: 'number', numberFormat:'F' },
          { name: 'card', title: 'Cart Number', type: 'card'},
          { name: 'bool1', title: 'Boalean', type: 'boolean'},
          { name: 'iban', title: 'Iban Number', type: 'iban'},
          { name: 'email', title: 'Mail',  type: 'mail' },
          { name: 'telephone', title: 'telephone',  type: 'telephone' },
        ],
        dataSource1:mockData2,
        selectedIndexes1:[],
        height:600
      };
    }
  }

  _buttonOnClick2() {
    this.setState({
      dataSource1:this.mockData2.slice(0, 15),
      selectedIndexes1:[0, 1, 2, 3],
      height:450
    });
  }

  generate(context, self) {

    return [
      {
        'text': 'Multiple Select',
        'component':
  <div>
    <BCard context={context}  >
      <BDataGrid
            ref={r => self.multigrid = r}
            context={context}
            height={this.self.state.height}
            dataSource={this.self.state.dataSource1}
            columns={this.self.state.columns}
            selectable={BDataGrid.Selectables.MULTIPLE}
            selectedIndexes={this.self.state.selectedIndexes1}
          />
    </BCard>

    <div style={{margin:10}}>
      <button onClick={this._buttonOnClick2.bind(self)}>Set State</button>
    </div>


  </div>
      }

    ];
  }
}
export default BDataGridTestGenerator;
