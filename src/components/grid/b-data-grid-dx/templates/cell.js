import React from 'react';
import {
  VirtualTable
} from '@devexpress/dx-react-grid-material-ui';
import { UIHelper } from './../ui-helper';

/**
 *handleOnClick
 *
 * @param {*} grid
 * @param {*} props
 * @returns
 */
function handleOnClick(grid:any, props: any) {
  if (grid.state.selectable=='none') {
    return;
  }

  /**
   * react ve editTemplate alanları dolu ie tıklamalarda sorun oluşturmaması için satır seçimi yaptırılmıyor.
   * Eğer bu alanları kullanırken satır seçimini de kullanmak istenirse  clickable alanı true verilmelidir.
   */
  if ((props.column.reactTemplate ||  props.column.editTemplate )
    && !props.column.clickable)
  {
    return;
  }

  if (grid.state.selectable=='single' || grid.state.selectable=='singleNonPointer' ) {
    grid.state.dataSource.map((element)=>{element.isSelected=false;});
    props.row.isSelected=true;
  }

  else {
    props.row.isSelected=!props.row.isSelected;
  }

  grid.lastSelectionChangedRow=props.row;
  grid.onRowSelectionChanged();

}
export class Cell {

  static template(grid:any, props: any) {

    let baseCellStyle={
      borderBottomWidth:0,
      paddingBottom:props.column.reactTemplate ?0 : 5,  // reactTemplate var ise padding eklenmeyecek
      paddingTop:props.column.reactTemplate ?0 : 5,
      textAlign:props.column.align
    };

    let baseTextStyle={
      fontSize:14,
      color:grid.state.context.theme.boaPalette.base450
    };
    let value={};
    if (props.children)
      value=props.children;
    else {
      value=UIHelper.getFormatedColumnValue(props.value, props.column, props.row);
    }
    if (props.column.cellStyle || props.column.textStyle ) {
      let cellStyle=props.column.cellStyle && props.column.cellStyle(props.row, grid.state.context, props.column);
      let textStyle=props.column.textStyle && props.column.textStyle(props.row, grid.state.context, props.column);
      baseCellStyle=Object.assign({}, baseCellStyle, props.style, cellStyle);
      baseTextStyle=Object.assign({}, baseTextStyle, props.style, textStyle);
    }

    let timer = 0;
    let delay = 200;
    let prevent = false;

    return (
      <VirtualTable.Cell
        style={baseCellStyle}
        onClick={()=>{

          // onRowDoubleClick eventı bağlanmış ise yakalayabilmek adına beklenmesi gerekiyor...
          if (grid.props.onRowDoubleClick) {
            timer = setTimeout(() => {
              if (!prevent) {
                handleOnClick(grid, props);
              }
              prevent = false;
            }, delay );
          }
          else {
            handleOnClick(grid, props);
          }
        }}
        onDoubleClick={()=>{
          clearTimeout(timer);
          prevent = true;
          grid.props.onRowDoubleClick &&
            grid.props.onRowDoubleClick(props.row);
        }}
        >
        <span
          style={baseTextStyle}
        >
          {value}
        </span>
      </VirtualTable.Cell>
    );

  }

}

export default Cell;
