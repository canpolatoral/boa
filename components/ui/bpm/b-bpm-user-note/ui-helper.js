import React from 'react';
import BUserNoteItem from './item';

import { BDivider } from 'b-divider';

export class UIHelper {

  constructor() {

  }

  static populateItems(list: any, form:any) {
    if (list) {
      let historyButtonList = new Array();
      list.forEach((element: any, index: number) => {
        var dividerVisibility=index==list.length-1 ? false:true;
        historyButtonList.push(this.createItem(element, form, dividerVisibility));
      }, this);
      return historyButtonList;
    }
  }

  static createItem(noteItem: any, form:any, dividerVisibility:boolean) {
    let uniqueKey ='0'+ (noteItem.instanceUserNoteId!=null ?  noteItem.instanceUserNoteId:'1');
    return (
      <div>
        <BUserNoteItem
          context={form.props.context}
          noteItem={noteItem}
          key={uniqueKey} />

        <BDivider
          context={form.props.context}
          style={{
            display:dividerVisibility==false? 'none':'',
            width: 'calc(100% + 18px)',
            marginBottom:18,
            marginLeft:0,
            marginRight:-18,
            marginTop:0
          }} />
      </div>
    );
  }

  static generateTextInfo(context, label, info) {
    if (info == '' || info == undefined) {
      info = '-';
    }
    var returnInfo =
      (
        <p style={{
          marginBottom:0,
          marginTop:0,
          minHeight:22
        }}>
          <span style={{
            color: context.theme.boaPalette.base300,
            fontSize: 12
          }}
           >
            {label}
          </span>

          <span style={{
            color: context.theme.boaPalette.base300,
            fontSize: 12,
            marginRight:5,
          }}
           >
            :
          </span>

          <span style={{
            color: context.theme.boaPalette.base450,
            fontSize: 14
          }}
           >
            {info}
          </span>
        </p>
      );
    return returnInfo;
  }

}
export default UIHelper;
