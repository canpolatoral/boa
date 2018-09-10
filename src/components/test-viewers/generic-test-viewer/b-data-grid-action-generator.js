import React from 'react';
// import BDataGrid from './../../../components/ui/grid/b-data-grid-test/index';
import { BGridActionPanel } from 'b-grid-action-panel';

let mockData = require('./mock/mock-datagrid.json');
let mockData2 = require('./mock/mock-datagrid.json');
import { BDateTimePicker } from 'b-datetime-picker';
import { BInput } from 'b-input';
import { BIconButton } from 'b-icon-button';
import { BCheckBox } from 'b-check-box';
import { BComboBox } from 'b-combo-box';
import { BCard } from 'b-card';


export class BDataGridActionTestGenerator {

  initialize(self) {

    this.self = self;
    if (!self.state) {
      self.state = {};
    }
  }

  getMultiSelectedItems() {
    console.log('----getMultiSelectedItems----');
    console.log(this.self.multigrid.getSelectedItems());
    console.log('-----------------------------');
  }

  getMultiSelectedRowIndexes() {
    console.log('----getMultiSelectedRowIndexes----');
    console.log(this.self.multigrid.getSelectedRowIndexes());
    console.log('-----------------------------');
  }

  getSingleSelectedItems() {
    console.log('----getMultiSelectedItems----');
    console.log(this.self.singlegrid.getSelectedItems());
    console.log('-----------------------------');
  }

  getSingleSelectedRowIndexes() {
    console.log('----getMultiSelectedRowIndexes----');
    console.log(this.self.singlegrid.getSelectedRowIndexes());
    console.log('-----------------------------');
  }

  onSingleRowSelectionChanged(item, index) {
    console.log('----onRowSelected----');
    console.log(item);
    console.log(index);
    console.log('-----------------------------');
  }

  onMultiRowSelectionChanged(item, index) {
    console.log('----onRowSelected----');
    console.log(item);
    console.log(index);
    console.log('-----------------------------');
  }

  onSingleRowUpdated(row) {
    console.log('----onRowUpdated----');
    console.log(row.rowIdx);
    console.log(row.updated);
    console.log('-----------------------------');
  }

  onMultiRowUpdated(row) {
    console.log('----onRowUpdated----');
    console.log(row.rowIdx);
    console.log(row.updated);
    console.log('-----------------------------');
  }

  generate(context, self) {
    this.dataSource=Object.assign([], mockData.slice(0, 1));

    this.columns = [
      { key: 'name', name: 'Name' },
      { key: 'gender', name: 'Gender' },
      { key: 'birthDate', name: 'Birth Date', type: 'date'},
      { key: 'company', name: 'Company' }

    ];

    return [
      {
        'text': 'Single',
        'component':
  <div>
    <BCard context={context}  >
      <BGridActionPanel
          ref={r => self.multigrid = r}
          context={context}
          dataSource={ mockData.slice(0, 10)}
          columns={this.columns}
          onRowSelectionChanged={this.onMultiRowSelectionChanged.bind(this)}
          onRowUpdated={this.onMultiRowUpdated.bind(this)}
          showAddButton={true}
          showDeleteButton={true}
          showEditButton={true}
          showHistoryButton={true}
          headerBarOptions={{
            show: true,
            title: 'İzin Bilgileri',
            showTitle: true,
            showGrouping: false,
            showFiltering: false,
            showMoreOptions: true,
            showDivit: false,
            showDelete: false,
            showAdd:false,
            onToggleAdd:()=>{
              self.multigrid.addNewRow();
            }
          }}
          />
    </BCard>
  </div>
      },


      {
        'text': 'Multiple',
        'component':
  <div>
    <BCard context={context}  >
      <BGridActionPanel
          ref={r => self.multigrid2 = r}
          context={context}
          dataSource={Object.assign([], mockData.slice(0, 10))}
          columns={ Object.assign([], this.columns)}
          onRowSelectionChanged={this.onMultiRowSelectionChanged.bind(this)}
          selectable='multiple'
          onRowUpdated={this.onMultiRowUpdated.bind(this)}
          showAddButton={true}
          showDeleteButton={true}
          showEditButton={true}
          showHistoryButton={true}
          headerBarOptions={{
            show: true,
            title: 'İzin Bilgileri',
            showTitle: true,
            showGrouping: false,
            showFiltering: false,
            showMoreOptions: true,
            showDivit: false,
            showDelete: false,
            showAdd:false,
            onToggleAdd:()=>{
              self.multigrid.addNewRow();
            }
          }}
          />
    </BCard>
  </div>
      },
    ];
  }
}
export default BDataGridActionTestGenerator;
