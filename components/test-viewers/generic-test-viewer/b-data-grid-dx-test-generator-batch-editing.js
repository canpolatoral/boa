import React from 'react';
import BDataGrid from 'b-data-grid-dx';
// import BDataGrid from './../../../components/ui/grids/b-data-grid-copy/index';
var mockData = require('./mock/mock-datagrid.json');
import { BCard } from 'b-card';
import { BDateTimePicker } from 'b-datetime-picker';
import { BInput } from 'b-input';
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

    let mock1=JSON.parse(JSON.stringify(mockData));

    this.self = self;
    if (!self.state) {
      self.state = {
        columns:[
          { name: 'name', title: 'Name' },
          { name: 'email',
            title: 'Mail',
            reactTemplate:
              (dataitem, innerContext) =>{
                return (
                  <BInput
                    context={innerContext}
                    value={dataitem && dataitem.name }
                    hintText={'Giriniz'}
                    onChange={(e, v)=>{
                      dataitem.name=v;
                    }}
                    onBlur={()=>{
                      // dataitem.company='İsim değişti:'+ dataitem.name;
                      // self.multigrid.refreshGrid();
                    }}
                  />
                );
              }
          },

          { name: 'bestFriends',
            title: 'Best Friends',
            reactTemplate:
            (dataitem, innerContext) =>{
              return (
                <BComboBox
                  context={innerContext}
                  hintText={'Seçiniz'}
                  dataSource={
                  [
                    {
                      'id': 0,
                      'name': 'Elizabeth Farmer'
                    },
                    {
                      'id': 1,
                      'name': 'Beck Walter'
                    },
                    {
                      'id': 2,
                      'name': 'Gordon Lindsay'
                    }
                  ]
                  }
                  multiSelect={false}
                  multiColumn={false}
                  displayMemberPath='name'
                  valueMemberPath='id'
                  isAllOptionIncluded={false}
                  value={dataitem && dataitem.friendId && [dataitem.friendId]}
                  onSelect={(index, selectedItems, selectedValues)=>{
                    dataitem.friendId=selectedValues[0];
                  }}
              />
              );
            }
          },
          { name: 'isActive',
            title: 'Boolean',
            width:100,
            reactTemplate:(dataitem, innerContext) =>{
              return (
                <BCheckBox
                  context={innerContext}
                  checked={dataitem.isActive}
                  onCheck={(e, v) => {
                    dataitem.isActive=v;
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
          },

          { name: 'date1',
            title: 'Date',
            type: 'date',
            width:200,
            reactTemplate:(dataitem, innerContext) =>{
              return (
                <BDateTimePicker
                  context={innerContext}
                  hintText='İşlem Tarihi'
                  pageType='transactional'
                  value={new Date()}
                  format={'DDMMYYYY'}
                  dateOnChange={(event: any, value: any) => {
                    dataitem.registered=BLocalization.formatDateTime(value, 'L');
                    // gerekirse datasource da..
                  }}
                />
              );
            }
          },

          { name: 'buttonEx',
            title: 'Button',
            width:100,
            reactTemplate:(dataitem, innerContext) =>{
              return (
                <BIconButton
                    iconProperties={{
                      nativeColor: innerContext.theme.boaPalette.pri500
                    }}
                    context={innerContext}
                    dynamicIcon='Send'
                    tooltip={'tooltip'}
                    style={{
                      alignSelf: 'center', height: 24, width: 24
                    }}
                    onClick={()=>{

                    }}
                  />
              );
            }
          },

        ],

        dataSource: Object.assign([], mock1.slice(0, 5)),
      };
    }
  }


  generate(context, self) {

    return [

      {
        'text': 'Editable Cell',
        'component':
  <div>
    <BCard context={context}  >
      <BDataGrid
            ref={r => self.grid = r}
            context={context}
            dataSource={this.self.state.dataSource}
            columns={this.self.state.columns}
            selectable='multiple'
            headerBarOptions={{
              show: true,
              title: 'İzin Bilgileri',
              showTitle: true,
              showGrouping: false,
              showFiltering: false,
              showMoreOptions: true,
              showDivit: true,
              showDelete: true,
              showAdd:true,
              onToggleAdd:()=>{
                self.grid.addNewRow({});
              },
              onToggleDivit:()=>{
                console.log('Divit clicked');
              },
              onToggleDelete:()=>{
                self.grid.deleteRows(self.grid.getSelectedItems());
              },
            }}

          />
    </BCard>
    </div>
      }
    ];
  }
}
export default BDataGridTestGenerator;
