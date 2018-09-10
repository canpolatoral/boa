import React from 'react';
import BCheckBox from 'b-check-box';
import { BRadioButton } from 'b-radio-button';

function checkBoxStyle () {
  return {
    width: 36,  // header ile birlikte 56 olacak
    marginRight: 12,
    marginLeft: 12,
    marginTop:0,
    height: 24
  };
}

export class Selection {

  static cellSelection(grid:any, props: any) {

    if (grid.state.selectable=='multiple')
      return (
        <td >
          <BCheckBox
            context={grid.props.context}
            checked={props.row.isSelected}
            onCheck={(e) => {
              e.stopPropagation();
              props.row.isSelected=!props.row.isSelected;
              grid.lastSelectionChangedRow=props.row;
              props.onToggle && props.onToggle();
              props.onChange && props.onChange();
            }}

            style={checkBoxStyle(grid, props)}
          />
        </td>
      );

    else if (grid.state.selectable=='single')
      return (
        <td   >
          <div style={{
            marginLeft:18,
            marginRight:6,
            width:36,
            height:24,
            marginTop:-10
          }}>
            <BRadioButton
                context={grid.props.context}
                checked={props.row.isSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  grid.state.dataSource.map((element)=>{element.isSelected=false;}); // diğer seçimler kaldırılıyor.
                  props.row.isSelected=!props.row.isSelected;
                  grid.lastSelectionChangedRow=props.row;
                  props.onToggle && props.onToggle();
                  props.onChange && props.onChange();
                }}

              />

          </div>

        </td>
      );

    else if (grid.state.selectable=='singleNonPointer'|| grid.state.selectable=='none')
      return (
        <td
          style={{
            visibility:'hidden'
          }}
          checked={props.row.isSelected}
          onClick={(e) => {
            e.stopPropagation();
            // props.row.isSelected=!props.row.isSelected;
            grid.lastSelectionChangedRow=props.row;
            props.onToggle && props.onToggle();
            props.onChange && props.onChange();
          }}
        />
      );
  }


  static headerSelection(grid:any, props: any) {
    return (
      <th style={{borderBottom:'1px solid rgba(224, 224, 224, 1)'}} >
        <BCheckBox
          disabled={props.disabled}
          context={grid.props.context}
          checked={props.allSelected}
          indeterminate={props.someSelected}
          onCheck={(e) => {
            e.stopPropagation();
            let allSelected=props.allSelected ? false: !props.someSelected;
            grid.state.dataSource.map((element)=>{element.isSelected=allSelected;});
            props.onToggle && props.onToggle();
            props.onChange && props.onChange();
          }}
          style={ checkBoxStyle(grid, props, true)}
        />
      </th>

    );
  }


  /**
   * treeSelection
   * @param {*} grid
   * @param {*} props
   */
  static treeSelection() {

    return (
      <td
        style={{
          visibility:'hidden'
        }}
      />
    );

  }
}

export default Selection;
