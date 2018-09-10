import React from 'react';
import BDataGrid from 'b-data-grid-dx';
// import BDataGrid from './../../../components/ui/grid/b-data-grid-copy/index';
var mockData = require('./mock/mock-datagrid.json');
import { BCard } from 'b-card';
import { Paper } from '@material-ui/core';
import { BComponent } from 'b-component';


export class BDataGridTestGenerator {

  initialize(self) {

    mockData.forEach(element => {

      element.credit={balance:5};

    });

    let mock1=JSON.parse(JSON.stringify(mockData));
    let mock2=JSON.parse(JSON.stringify(mockData));
    let mock3=JSON.parse(JSON.stringify(mockData));
    let mock4=JSON.parse(JSON.stringify(mockData));

    mock1[8].isSelected=true;  // selected source datasource



    this.self = self;
    if (!self.state) {
      self.state = {
        columns:[
          { name: 'name', title: 'Name' },
          { name: 'gender', title: 'Gender' },
          { name: 'company', title: 'Company' },
          { name: 'eyeColor', title: 'eyeColor'  },
          { name: 'greeting', title: 'greeting'  },
          { name: 'email', title: 'email', hidden:true },
          { name: 'phone', title: 'phone', width:0 },
          { name: 'credit.balance', title: 'Balance'}, //childObject

        ],
        dataSource1:mock1.slice(0, 600),
        dataSource2:mock2.slice(0, 150),
        dataSource3:mock3.slice(0, 150),
        selectedIndexes1:[0, 1, 5],


        height:500
      };
    }
  }

  _buttonOnClick2() {

    console.log(this.multigrid.getSelectedItems());

    BComponent.FormManager.saveGridSetting('aliilhan', 'yönt', 'setting');



    // this.setState({
    //   dataSource1:mock1.slice(0, 150),
    //   dataSource2:mock2.slice(0, 150),
    //   dataSource3:mock3.slice(0, 150),
    //   selectedIndexes1:[0, 1, 2, 3],
    //   height:450
    // });
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
            // onRowDoubleClick={(row)=>{
            //   console.log(row);
            //   alert(JSON.stringify(row));
            // }}
          />
    </BCard>

    <div style={{margin:10}}>
      <button onClick={this._buttonOnClick2.bind(self)}>Set State</button>
    </div>


  </div>
      },

      {
        'text': 'Single Select',
        'component':
  <div>
    <BCard context={context} >
      <BDataGrid
            ref={r => self.multigrid1 = r}
            context={context}
            height={700}
            dataSource={this.self.state.dataSource2}
            columns={this.self.state.columns}
            selectable={BDataGrid.Selectables.SINGLE}
            selectedIndexes={[1, 3, 4]}

          />

    </BCard>


  </div>
      },
      {
        'text': 'singleNonPointer Select',
        'component':
  <div>
    <BCard context={context} >
      <BDataGrid
            ref={r => self.multigrid2 = r}
            context={context}
            height={700}
            dataSource={this.self.state.dataSource3}
            columns={this.self.state.columns}
            selectable={BDataGrid.Selectables.SINGLENONPOINTER}
            selectedIndexes={[1, 3, 4]}
          />

    </BCard>


  </div>
      },

      ,
      {
        'text': 'Dynamic Table Height',
        'component':
  <div>
    <BCard context={context} >
      <BDataGrid
            ref={r => self.multigrid3 = r}
            context={context}
            dataSource={this.self.state.dataSource3.slice(0, 4)}
            columns={this.self.state.columns}
            selectable={BDataGrid.Selectables.MULTIPLE}
            maxHeight={500}
          />

    </BCard>


  </div>
      },

      {
        'text': 'Controlled Mode',
        'component':
  <div>
    <BCard context={context} >
      <BDataGrid
            context={context}
            maxHeight={500}
            dataSource={this.self.state.dataSource1}
            columns={this.self.state.columns}
            selectable={BDataGrid.Selectables.SINGLENONPOINTER}
            grouping={[
                {columnName:'company'}
              ]}

            filters={[
              {columnName:'gender', value:'male'}
            ]}
          />

    </BCard>


  </div>
      },


    ];
  }
}
export default BDataGridTestGenerator;
