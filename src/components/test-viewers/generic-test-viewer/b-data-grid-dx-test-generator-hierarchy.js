import React from 'react';
import BDataGrid from 'b-data-grid-dx';
// import BDataGrid from './../../../components/ui/grid/b-data-grid-copy/index';
var mockData = require('./mock/mock-datagrid.json');
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
      { key: 'name', name: 'Name'   },
      { key: 'gender', name: 'Gender' },
      { key: 'birthDate', name: 'Birth Date', type: 'date'},
      { key: 'company', name: 'Company' },
      { key: 'email', name: 'Email'  },

    ];

    return [

      {
        'text': 'Detail Row',
        'component':
  <div>
    <BCard context={context}  >
      <BDataGrid
          ref={r => self.multigrid = r}
          context={context}
          height={700}
          dataSource={mockData.slice(0, 100)}
          columns={this.columns}
          selectable='singleNonPointer'
          rowDetail={(row, innerContext)=>{
            return (
              <div  style={{
                backgroundColor:innerContext.theme.boaPalette.info500,
                color:'white',
                height:50
              }}>
                Details for {row.name} email: {row.email} ...
              </div>
            );
          }}
         />
    </BCard >
  </div>
      },

      {
        'text': 'External DataSource',
        'component':
  <div>
    <BCard context={context}  >
      <BDataGrid
          ref={r => self.multigrid = r}
          context={context}
          height={700}
          dataSource={mockData.slice(0, 100)}
          columns={this.columns}
          selectable='multiple'
          subGridProperties={()=>{

            let subGridProperties={
              dataSource:mockData.slice(0, 20),
              columns:[
                { key: 'name', name: 'Name'   },
                { key: 'gender', name: 'Gender' },
                { key: 'birthDate', name: 'Birth Date', type: 'date'},
              ],
              // verilmek istenirse diğer datagrid özellikleri buradan belirtilebilir, belirtilmezse parent grid in özelliklerini kullanır.
              selectable:'singleNonPointer',
              multiSelection:false,
              filterable: false,
              height:350
            };

            return subGridProperties;

          }}
         />
    </BCard >
  </div>
      },

      {
        'text': 'With DataSourceName',
        'component':
  <div>
    <BCard context={context}  >
      <BDataGrid
          ref={r => self.multigrid = r}
          context={context}
          height={700}
          dataSource={mockData.slice(0, 100)}
          columns={this.columns}
          selectable='singleNonPointer'
          subGridProperties={()=>{

            let subGridProperties={
              dataSourceName:'friends', // satır içerisindeki bir field adı verilmelidir.
              dataSource:null,          // istenilirse doğrudan dataSource ataması yapılabilir, (datasource alanına row.friends vermek ile aynı şey)
              columns:[
                {key: 'id', name: 'Id', },
                {key: 'name', name: 'Name' },

              ],
              // verilmek istenirse diğer datagrid özellikleri buradan belirtilebilir, belirtilmezse parent grid in özelliklerini kullanır.
              selectable:'singleNonPointer',

            };

            return subGridProperties;

          }}
         />
    </BCard>
  </div>
      },

      {
        'text': 'With Row DataSource',
        'component':
  <div>
    <BCard context={context}  >
      <BDataGrid
          ref={r => self.multigrid = r}
          context={context}
          height={700}
          dataSource={mockData.slice(0, 100)}
          columns={this.columns}
          selectable='singleNonPointer'
          subGridProperties={(row)=>{

            let subGridProperties={
              dataSource:row.friends,
              columns:[
                {key: 'id', name: 'Id', },
                {key: 'name', name: 'Name' },

              ],
              // verilmek istenirse diğer datagrid özellikleri buradan belirtilebilir, belirtilmezse parent grid in özelliklerini kullanır.
              selectable:'singleNonPointer',
            };

            return subGridProperties;

          }}
         />
    </BCard>
  </div>
      },
      {
        'text': 'Two Level',
        'component':
  <div>
    <BCard context={context}  >
      <BDataGrid
          ref={r => self.multigrid = r}
          context={context}
          height={700}
          dataSource={mockData.slice(0, 100)}
          columns={this.columns}
          selectable='singleNonPointer'
          subGridProperties={()=>{

            let subGridProperties={
              dataSource:mockData.slice(0, 20),
              columns:[
                { key: 'name', name: 'Name'   },
                { key: 'gender', name: 'Gender' },
                { key: 'birthDate', name: 'Birth Date', type: 'date'},

              ],
              // verilmek istenirse diğer datagrid özellikleri buradan belirtilebilir, belirtilmezse parent grid in özelliklerini kullanır.
              selectable:'singleNonPointer',

              subGridProperties:(row)=>{
                return {
                  dataSource:row.friends,
                  columns:[
                    {key: 'id', name: 'Id', },
                    {key: 'name', name: 'Name' },

                  ],
                  // verilmek istenirse diğer datagrid özellikleri buradan belirtilebilir, belirtilmezse parent grid in özelliklerini kullanır.
                  selectable:'singleNonPointer',
                };
              }
            };

            return subGridProperties;

          }}
         />
    </BCard>
  </div>
      }
    ];
  }
}
export default BDataGridTestGenerator;
