import React from 'react';
import BRouteHistoryItem from './item';
import BRouteHistoryExpandableItem from './expandable-item';

export class UIHelper {

  constructor() {

  }

  static populateHistoryItems(historyList: any, form:any, isExpanded:boolean, settingContract: any) {
    if (historyList) {
      let historyButtonList = new Array();
      historyList.forEach((element: any, index: number) => {
        var dividerVisibility=index==historyList.length-1 ? false:true;
        historyButtonList.push(this.createHistoryItem(element, form, isExpanded, dividerVisibility, settingContract));
      }, this);
      return historyButtonList;
    }
  }

  static createHistoryItem(historyItem: any, form:any, isExpanded:boolean, dividerVisibility:boolean, settingContract: any) {
    let uniqueKey ='0'+ (historyItem.instanceStateId!=null ?  historyItem.instanceStateId:'1')
      + (historyItem.orderNumber!=null ?  historyItem.orderNumber:'2')
      + (historyItem.userStartDate!=null ?  historyItem.userStartDate:'3')
      + (historyItem.userEndDate!=null ?  historyItem.userEndDate:'3')
      + (historyItem.name!=null ?  historyItem.name:'3')
      +(historyItem.userName!=null ?  historyItem.userName:'4');
      // yukarıdaki key e ne gerek vardı ki deme lütfen.

    if (historyItem.itemType==1 || historyItem.itemType==2 || historyItem.itemType==3 || historyItem.itemType==7) { // başlangıç, bitiş, durum, alt durum
      return (
        <BRouteHistoryItem
                      context={form.props.context}
                      historyItem={historyItem}
                      key={uniqueKey}
                      form={form}
                      isExpanded={isExpanded}
                      dividerVisibility={dividerVisibility}
                      settingContract={settingContract}/>
      );
    }

    else if (historyItem.itemType==5 || historyItem.itemType==6) { // ilişkili veya alt akış
      return (
        <BRouteHistoryExpandableItem
                      context={form.props.context}
                      historyItem={historyItem}
                      itemTypeName={historyItem.itemTypeName}
                      key={uniqueKey}
                      form={form}
                      isExpanded={isExpanded}
                      settingContract={settingContract}/>
      );
    }

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

  static ItemStatus={
    APPROVED:0,
    REJECTED:1,
    WORKING:2,
    NOTSTARTED:3,
    USERDIDNOTACTION:4
  }
}
export default UIHelper;
