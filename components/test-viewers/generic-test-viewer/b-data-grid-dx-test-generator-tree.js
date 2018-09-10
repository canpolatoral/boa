import React from 'react';
import BDataGrid from 'b-data-grid-dx';

import { tasks, employees, priorities } from './mock/mock-datagrid-dx-tree.json';

import { BCard } from 'b-card';


export class BDataGridTestGenerator {

  initialize(self) {

    this.self = self;
    if (!self.state) {
      self.state = {};
    }
  }

  generate(context, self) {

    this.columns = [
      { key: 'Subject', name: 'Task Subject', width:300   },
      { key: 'Status', name: 'Status' },
      { key: 'Start_Date', name: 'Birth Date', type: 'date'},
      { key: 'Due_Date', name: 'Due Date', type: 'date' }

    ];

    this.dataSource=tasks;

    this.treeDataOptions={
      for:'Subject',
      getChildRows:(row, rootRows, innerContext )=>{
        const childRows = rootRows.filter(r => r.Parent_ID === (row ? row.ID : 0));
        return childRows.length ? childRows : null;
      }
    };

    return [
      {
        'text': 'Tree Data',
        'component':
  <div>
    <BCard context={context}  >
      <BDataGrid
          ref={r => self.multigrid = r}
          context={context}
          height={700}
          dataSource={this.dataSource}
          columns={this.columns}
          // selectable='multiple'
          treeDataOptions={this.treeDataOptions}

         />
    </BCard >
  </div>
      }
    ];
  }
}
export default BDataGridTestGenerator;
