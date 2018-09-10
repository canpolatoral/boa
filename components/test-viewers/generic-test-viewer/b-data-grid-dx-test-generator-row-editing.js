import React from 'react';
import BDataGrid from 'b-data-grid-dx';
// import BDataGrid from './../../../components/ui/grids/b-data-grid-copy/index';
var mockData = require('./mock/mock-datagrid.json');
import { BCard } from 'b-card';
import { BDateTimePicker } from 'b-datetime-picker';
import { BInputNumeric } from 'b-input-numeric';
import { BIconButton } from 'b-icon-button';
import { BCheckBox } from 'b-check-box';
import { BComboBox } from 'b-combo-box';
import { FilteringState } from '@devexpress/dx-react-grid';
import { BLocalization } from 'b-localization';
import { BParameterComponent } from 'b-parameter-component';



var Done = require('b-icon').Actions .Done;
var RemoveCircle = require('b-icon').Actions .RemoveCircle;

export class BDataGridTestGenerator {

  initialize(self) {

    this.self = self;
    if (!self.state) {
      self.state = {
        columns:[
          {
            name: 'name',
            title: 'Name'
          },
          {
            name: 'registered',
            title: 'Registered',

            editTemplate:(row, innerContext) =>{
              return (
                <BDateTimePicker
                  context={innerContext}
                  hintText='Kayıt Tarihi'
                  pageType='transactional'
                  value={new Date()}
                  format={'DDMMYYYY'}
                  dateOnChange={(event: any, value: any) => {
                    row.registered=BLocalization.formatDateTime(value, 'L');
                  }}
                />
              );
            }
          },

          {
            name: 'gender',
            title: 'Gender',

            editTemplate:(row, innerContext) =>{
              return (
                <BComboBox
                  context={innerContext}
                  hintText={'Seçiniz'}
                  dataSource={
                  [
                    {
                      'id': 0,
                      'name': 'male'
                    },
                    {
                      'id': 1,
                      'name': 'female'
                    }
                  ]
                  }
                  multiSelect={false}
                  multiColumn={false}
                  displayMemberPath='name'
                  valueMemberPath='id'
                  isAllOptionIncluded={false}
                  value={row && row.gender=='male' ? [0]:[1]}
                  onSelect={(index, selectedItems, selectedValues)=>{
                    row.gender=selectedItems[0].name;

                    if(row.gender =='male')
                      row.maxLength=10;
                    else if (row.gender =='female')
                      row.maxLength=20;

                      this.self.grid.refreshGrid();

                  }}
              />
              );
            }
          },

          {
            name: 'regionName',
            title: 'Region',

            editTemplate:(row, innerContext) =>{
              return (
                <BParameterComponent
                  context={innerContext}
                  // selectedParamCode={self.state.selectedParamCode}
                  paramType={'ULKE'}
                  selectedParamCode={row.regionId}
                  onParameterSelect={(parameter) => {
                    row.regionName=parameter.paramDescription;
                    row.regionId=parameter.paramCode;
                    console.log(parameter);
                  }}
                  paramColumns={
                  [
                    { name: 'paramType',header:'paramType header', width: 150, visible: false },
                    { name: 'paramCode',header:'paramCode header', width: 130, visible: false },
                    { name: 'paramDescription',header:'paramDescription header', width: 200, visible: true },
                    { name: 'paramValue',header:'paramValue header', width: 100, visible: false }
                  ]
                  }
                />
              );
            }
          },

          {
            name: 'key',
            title: 'Key',
            // type:'boolean',

            editTemplate:(row, innerContext) =>{
              return (
                <BInputNumeric
                  context={innerContext}
                  maxLength={row.maxLength ? row.maxLength : 5}

                />
              );
            }
          },

          {
            name: 'isActive',
            title: 'IsActive',
            type:'boolean',

            editTemplate:(row, innerContext) =>{
              return (
                <BCheckBox
                  context={innerContext}
                  checked={row.isActive}
                  onCheck={(e, v) => {
                    row.isActive=v;
                  }}

                  style={{
                    height: -1,
                    width: 24,
                    marginRight: 12,
                    marginLeft: 12,
                    marginTop:0
                  }}
                />
              );
            }
          }


        ],

        dataSource: Object.assign([], mockData.slice(0, 25)),
        // dataSource:[],
      };
    }
  }


  generate(context, self) {

    return [

      {
        'text': 'Row',
        'component':
  <div>
    <BCard context={context}  >
      <BDataGrid
            ref={r => self.grid = r}
            context={context}
            dataSource={this.self.state.dataSource}
            displayGridOnNoRow={true}
            columns={this.self.state.columns}
            headerBarOptions= {{
              title:'Sonuç Listesi',
              show: true,
              showTitle: true,
              showGrouping: false,
              showFiltering: true,
              showMoreOptions: true,
              showDelete: false,
              showDivit: false,
              showAdd: false
            }}
            editingDataOptions={{
              showAddCommand:true,
              showEditCommand:true,
              showDeleteCommand:true,
              emptyData:{  // yeni aksiyonda eklenen satır iin default değerler.
                name:'Yeni İsim',
                gender : 'male',
                isActive:true
              },
              onCommitChanges:( added, changed, deleted )=>{
                let cloneDataSource=Object.assign([], this.self.grid.getDataSource());
                if(added) {
                  cloneDataSource.push(added);
                }
                else if(deleted){
                  // todo: silinmeden kullanıcıdan onay alınmalı...
                  cloneDataSource=cloneDataSource.filter((row)=>{return row.rowIndex!=deleted.rowIndex});
                }
                else if(changed) {
                  // bileşenlerin change olaylarında güncelleme yapıldı. eğer ek işlem yapılacak ise buradan yapılaiblir.
                }

                this.self.setState({
                  dataSource:cloneDataSource
                });
              }
            }}

          />
    </BCard>

  </div>
      }

    ];
  }
}
export default BDataGridTestGenerator;
