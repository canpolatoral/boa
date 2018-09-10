import React from 'react';
import {
  VirtualTable
} from '@devexpress/dx-react-grid-material-ui';

export class Row {

  static template(grid:any, props: any) {
    let { row, ...restProps }=props;
    let baseRowStyle={
      backgroundColor: row.isSelected?  grid.state.context.theme.boaPalette.pri250:undefined,
      height:36,
      borderBottom:'1px solid rgba(224, 224, 224, 1)',
      cursor:'pointer',
      '&:hover': {
        backgroundColor:  grid.state.context.theme.boaPalette.pri350
      },
    };

    if (grid.state.rowStyle ) {
      let rowStyle=grid.state.rowStyle(row, grid.state.context);
      baseRowStyle=Object.assign(baseRowStyle, rowStyle);
    }

    return (
      <VirtualTable.Row
        {...restProps}
        style={baseRowStyle}
      />
    );
  }

  static headTemplate(grid:any, props: any) {

    // rowları bizim oluşturmamıza şuan izin vermiyor (v1.3)
    // desteklendiğinde aşağıdaki kod bloğu Table.Row ve Table.Cell yapısındakine benzer şekilde düznlenecek.
    let childrenArray=props.children;

    if (props.children &&
       props.children.length>0
       ) {

      props.children.forEach(element => {
        let cloneHeadRow=element;
        if (element.key=='heading' && element.props && element.props.children) {
          cloneHeadRow=React.cloneElement( element.props.children, { style: {height:36} } );
        }
        childrenArray.push(cloneHeadRow);
      });
    }

    return (
      <VirtualTable.TableHead
        children={childrenArray}
      >
      </VirtualTable.TableHead>
    );
  }
}

export default Row;
