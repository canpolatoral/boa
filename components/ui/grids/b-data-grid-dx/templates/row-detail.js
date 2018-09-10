import React from 'react';

import { BDataGrid } from './../index';


export class RowDetail {

  static template(grid:any, props: any) {

    if (grid.state.subGridProperties ) { // hierarchy grid

      let gridProperties=grid.state.subGridProperties(props.row, grid.state.context);

      return (
        <div style={{
          marginRight:-24,
          borderLeft:'1px solid rgba(224, 224, 224, 1)',
          borderRight:'1px solid rgba(224, 224, 224, 1)',
        }}>
          <BDataGrid
            // {...grid.props} bu gerekli mi emin değiliz. parent gridin özelliklerini aşağıya aktarmalı mıyız !

            {...gridProperties}
            context={grid.props.context}
            isInsideTheCard={false}
            dataSource={
              gridProperties.dataSource ?
              gridProperties.dataSource :
                props.row[gridProperties.dataSourceName]}
            subGridProperties={gridProperties.subGridProperties}
            headerBarOptions={{
              show: false,
            }}
          />
        </div>
      );
    }
    else {
      return grid.state.rowDetail(props.row, grid.state.context);
    }
  }

}

export default RowDetail;
