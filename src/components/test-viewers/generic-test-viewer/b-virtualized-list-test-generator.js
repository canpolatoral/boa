import React from 'react';
import BDataGrid from 'b-data-grid-dx';
var mockData = require('./mock/mock-datagrid-dx-full.json');
import { BCard } from 'b-card';
import { BVirtualizedList  } from 'b-virtualized-list';
import { BContentLoader  } from 'b-content-loader';

export class BDVirtualizedListTestGenerator {

  initialize(self) {


    mockData=JSON.parse(JSON.stringify(mockData));

    let mockData2=mockData.slice(0, 500);
    this.self = self;
    if (!self.state) {
      self.state = {
        dataSource:mockData2,
      };
    }
  }

  rowRenderer (activeRow, otherRowProps, innerContext ,test) {
    return (
      <BCard title={activeRow.paragraph}
          context={innerContext}
          style={{marginTop:24, marginRight:24, marginLeft:24}}
          >
        {/* <div>{activeRow.about} </div> */}

        <BContentLoader context={innerContext}>
          <rect x="74" y="24" rx="4" ry="4" width="117" height="6.4" />
          <rect x="75" y="40" rx="3" ry="3" width="85" height="6.4" />
          <rect x="14" y="75" rx="3" ry="3" width="350" height="6.4" />
          <rect x="14" y="90" rx="3" ry="3" width="380" height="6.4" />
          <rect x="10" y="163" rx="3" ry="3" width="201" height="6.4" />
          <circle cx="35.3" cy="41.3" r="22" />
          <rect x="12.01" y="5.15" rx="5" ry="5" width="249.69" height="7.5175" />
          <rect x="12.01" y="217.61" rx="5" ry="5" width="139" height="23.45" />
          <rect x="203.01" y="217.06" rx="5" ry="5" width="148" height="22.73" />
          <rect x="14.01" y="103.61" rx="5" ry="5" width="165" height="6" />
          <rect x="14.01" y="123.61" rx="5" ry="5" width="125" height="15" />
          <rect x="163.01" y="124.61" rx="5" ry="5" width="114" height="15" />
          <rect x="219.01" y="139.61" rx="5" ry="5" width="0" height="0" />
        </BContentLoader>

      </BCard>
    );
  }

  generate(context, self) {

    return [
      {
        'text': 'Basic',
        'component':
  <div style={{height:700}}>

    <BVirtualizedList
      context={context}
      dataSource={ this.self.state.dataSource}
      rowRenderer={this.rowRenderer.bind(this)}
      estimatedRowSize={ 120}
      overscanRowCount={5}
      cacheProperties={{
        minHeight:120,
        fixedWidth:true,
      }}
      >

    </BVirtualizedList>


  </div>
      }

    ];
  }
}
export default BDVirtualizedListTestGenerator;
