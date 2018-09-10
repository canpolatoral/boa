import React from 'react';
import BDataGrid from 'b-data-grid-dx';
// import BDataGrid from './../../../components/ui/grid/b-data-grid-copy/index';
var mockData = require('./mock/mock-datagrid-dx-full.json');
import { BCard } from 'b-card';

export class BDataGridTestGenerator {

  initialize(self) {

    let mock1=JSON.parse(JSON.stringify(mockData));

    let mockData2=mock1.slice(0, 40);

    this.self = self;
    if (!self.state) {
      self.state = {
        columns:[
          { name: 'fullname',
            title: 'Name',
            textStyle:
              (dataItem, innerContext, column) =>{

                const textStyle={
                  fontWeight: 'bold',
                  color:innerContext.theme.boaPalette.info500
                };
                return textStyle;
              }
          },

          { name: 'balance1',
            title: 'Balance'
          },

          { name: 'gender',
            title: 'Gender',
            width:200,
            cellStyle:
              (dataItem, innerContext, column) =>{

                const cellStyle={
                  backgroundColor: dataItem.gender  == 'Male' ? innerContext.theme.boaPalette.success500 : innerContext.theme.boaPalette.error500
                };

                return cellStyle;
              },
            textStyle:
              (dataItem, innerContext, column) =>{

                const textStyle={
                  color: 'white'
                };
                return textStyle;
              }

          },

          { name: 'date1',
            title: 'With Formated Cell',
            type: 'date',
            width:200,
            textStyle:
              (dataItem, innerContext, column) =>{

                const textStyle={
                  color: innerContext.theme.boaPalette.error500
                };
                return textStyle;
              }
          },


        ],

        columns2:[
          { name: 'fullname',
            title: 'Name',
          },

          { name: 'balance1',
            title: 'Balance'
          },

          { name: 'gender',
            title: 'Gender',
            width:200
          },

          { name: 'date1',
            title: 'With Formated Cell',
            type: 'date',
            width:200,
          },
          { name: 'car',
            title: 'Car',
            width:200,
          },

        ],

        dataSource1:mockData2,
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
        'text': 'Cell Style',
        'component':
  <div>
    <BCard context={context}  >
      <BDataGrid
            ref={r => self.multigrid = r}
            context={context}
            dataSource={this.self.state.dataSource1}
            columns={this.self.state.columns}
            height={500}


          />
    </BCard>

    <div style={{margin:10}}>
      <button onClick={this._buttonOnClick2.bind(self)}>Set State</button>
    </div>


  </div>
      },

      {
        'text': 'Row Style',
        'component':
  <div>
    <BCard context={context}  >
      <BDataGrid
            ref={r => self.multigrid2 = r}
            context={context}
            dataSource={this.self.state.dataSource1}
            columns={this.self.state.columns2}
            height={500}
            rowStyle={(dataItem, innerContext)=>{

              let backgroundColor;
              switch (dataItem.car) {
                case 'Ford': {
                  backgroundColor=innerContext.theme.boaPalette.error500;
                  break;
                }
                case 'Suzuki': {
                  backgroundColor=innerContext.theme.boaPalette.info500;
                  break;
                }
                case 'Mazda': {
                  backgroundColor=innerContext.theme.boaPalette.more500;
                  break;
                }
              }

              let style={
                backgroundColor:backgroundColor,
                color:'white'
              };
              return style;
            }}

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
