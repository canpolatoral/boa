import React from 'react';

import { BInput } from 'b-input';
import { BIconButton } from 'b-icon-button';

export class EditRow {

  static cellComponent(grid:any, props: any) {
    let editElement;
    if (props.column.editTemplate) {

      editElement = props.column.editTemplate(props.row, grid.props.context, props.column);
      if (editElement)
        editElement = React.cloneElement( editElement, { inlineGridMode: true } );
      else {
        editElement=<div></div>;
      }
    }
    else {
      editElement=(
        <BInput
          inlineGridMode={true}
          context={grid.props.context}
          value={props.value}
          hintText={'Giriniz'}
          onBlur={(event)=>{
            props.row[props.column.name]=event.target.value;
          }}
        />
      );
    }

    return (
      <td style={{
        paddingLeft:6,
        paddingRight:6
      }}>
        {editElement}
      </td>
    );
  }


  static commandComponent(grid:any, props: any) {
    let iconName='';
    let toolTip='';
    let nativeColor=grid.state.context.theme.boaPalette.pri500;


    switch (props.id) {
      case 'add': {
        iconName='Add';
        toolTip='Yeni';
        break;
      }
      case 'edit': {
        iconName='Edit';
        toolTip='Düzenle';
        break;
      }
      case 'delete': {
        iconName='Delete';
        toolTip='Sil';
        break;
      }
      case 'commit': {
        iconName='Save';
        toolTip='Kaydet';
        break;
      }
      case 'cancel': {
        iconName='Cancel';
        toolTip='Vazgeç';
        nativeColor=grid.state.context.theme.boaPalette.error500;
        break;
      }


    }

    return (

      <BIconButton
        iconProperties={{
          nativeColor: nativeColor
        }}
        context={grid.state.context}
        dynamicIcon={iconName}
        tooltip={toolTip}
        style={{
          // alignSelf: 'center', height: 24, width: 24
        }}
        onClick={()=>{
          props.onExecute();
        }}
      />

    );
  }
}

export default EditRow;
