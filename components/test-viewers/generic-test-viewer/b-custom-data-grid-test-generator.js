import React from 'react';
import BCustomDataGrid from 'b-custom-data-grid';
var mockData = require('./mock/mock-datagrid.json');
import { BCard } from 'b-card';
import { Paper } from '@material-ui/core';
import * as SvgIcons from '@material-ui/icons';


export class BCustomDataGridTestGenerator {

  initialize(self) {

    mockData.forEach(element => {

      element.credit={balance:5};

    });

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
        buttonList:[
            {label:'YETKİLERİN TÜMÜNÜ SEÇ', name:'CheckAll', icon:"DoneAll", disabled: false, SortOrder: 0}, 
            {label:'YETKİLERİN TÜMÜNÜ KALDIR', name:'UnCheckAll', icon:"HighlightOff", disabled: true, SortOrder: 1}, 
            {label:'GERI AL', name:'Reset', icon: "Replay", disabled: true, SortOrder: 2}, 
            {label:'KOPYALA', name:'Copy', icon: "ContentCopy", disabled: true, SortOrder: 3}, 
            {label:'YAPIŞTIR', name:'Paste', icon:"Assignment", disabled: true, SortOrder: 4}
        ],
        dataSource1:mockData.slice(0, 600),
        dataSource2:mockData.slice(0, 150),
        dataSource3:mockData.slice(0, 150),
        selectedIndexes1:[0, 1, 5],


        height:600
      };
    }
  }

  onClickFooter(data)
  {
    switch(data)
    {
        case 'CheckAll':
        break;
        default:
        break;
    }
  }


  generate(context, self) {

    return [
      {
        'text': 'Multiple Select',
        'component':
  <div>
    <BCard context={context}  >
        <BCustomDataGrid context={context}
            ref={r => self.singlegrid = r}
            dataSource={this.self.state.dataSource1}
            columns={this.self.state.columns}
            selectable={'single'}
            buttonList={this.self.state.buttonList}
            multiSelection={false}
            onFooterClicked={this.onClickFooter.bind(self)}
            headerBarOptions={{
                show: true,
                showTitle: true,
                title: 'Yetkiler'
            }} />
    </BCard>

  </div>
      },
    ];
  }
}
export default BCustomDataGridTestGenerator;
