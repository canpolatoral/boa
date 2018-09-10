import React from 'react';
import BDataGrid from 'b-data-grid-dx';
// import BDataGrid from './../../../components/ui/grids/b-data-grid-copy/index';
var mockData = require('./mock/mock-datagrid-dx-full.json');
import { BCard } from 'b-card';
import { BDateTimePicker } from 'b-datetime-picker';
import { BInput } from 'b-input';
import { BIconButton } from 'b-icon-button';
import { BCheckBox } from 'b-check-box';
import { BComboBox } from 'b-combo-box';

var Done = require('b-icon').Actions .Done;
var RemoveCircle = require('b-icon').Actions .RemoveCircle;

export class BDataGridTestGenerator {

  initialize(self) {

    let mockData2=mockData.slice(0, 40);

    this.self = self;
    if (!self.state) {
      self.state = {
        columns2:[
          { name: 'fullname', title: 'Name' },
          { name: 'image', title: 'Avatar',
            reactTemplate:(dataitem, innerContext)=>{
              var imgDivStyle = {
                width: '58px',
                height: '58px',
                borderWidth: 1,
                borderRadius: '50%',
                borderStyle: 'solid',
                borderColor: innerContext.theme.boaPalette.base150
              };
              return (
                <div >
                  <img
                    // src={dataitem.image1}  // ..base64
                    src={dataitem.avatar}
                    style={imgDivStyle}
                    />
                </div>
              );
            }
          },
          { name: 'bool1', title: 'Success',
            reactTemplate:(dataitem, innerContext)=>{

              var imgStyle = {
                width: 24,
                height: 24
              };
              if (dataitem.bool1) {
                return (
                  <Done
                    style={imgStyle}
                    context={innerContext}
                    color='green'
                    nativeColor='green'

                    />
                );
              }
              else {
                return (
                  <RemoveCircle
                    style={imgStyle}
                    context={innerContext}
                    color='red'
                    nativeColor='red' />
                );
              }
            }

          },
          { name: 'email', title: 'Mail',
            reactTemplate:(dataitem, innerContext)=>{

              var style = {
                color: innerContext.theme.boaPalette.pri500,
                cursor: 'pointer',
                textDecoration:'underline'

              };
              if (dataitem.email) {
                return (
                  <span style={style}
                  onClick={()=>{
                    if (innerContext.applicationContext.isBOALogin == true) {
                      window.open('mailto:' + dataitem.email);
                    }
                    else {
                      window.location.href = 'mailto:' + dataitem.email;

                    }
                  }}>
                    {dataitem.email}
                  </span>
                );
              }

            }

          }

        ],

        dataSource1:mockData2.slice(0, 5),
        dataSource2:Object.assign([], mockData2),
      };
    }
  }

  _buttonOnClick2() {
    this.setState({
      dataSource1:this.mockData2.slice(0, 5),
      selectedIndexes1:[0, 1, 2, 3],
      height:450
    });
  }

  generate(context, self) {

    return [

      {
        'text': 'Custom Cell',
        'component':
  <div>
    <BCard context={context}  >
      <BDataGrid
            ref={r => self.multigrid = r}
            context={context}
            dataSource={this.self.state.dataSource2}
            columns={this.self.state.columns2}
            height={500}


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
