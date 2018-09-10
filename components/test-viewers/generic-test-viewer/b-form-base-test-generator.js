import React from 'react';
var BCard = require('b-card').BCard;
var BInput = require('b-input').BInput;
var BTransactionForm = require('b-transaction-form').BTransactionForm;
var BBrowseForm = require('b-browse-form').BBrowseForm;
var mockData = require('./mock/mock-datagrid.json');
import { BVirtualizedList  } from 'b-virtualized-list';

export class BFormBaseTestGenerator {
  constructor() {
    this.disabled = false;

    this.columns = [
      { name: 'name', title: 'Name', width: 200 },
      { name: 'gender', title: 'Gender', editable: false },
      { name: 'birthDate', title: 'Birth Date', type: 'date' },
      { name: 'company', title: 'Company' },
      { name: 'email', title: 'Email' },
      { name: 'phone', title: 'Phone' },
      { name: 'address', title: 'Address' }
    ];
    this.dataSource=mockData.slice(0, 150);

  }


  rowRenderer (activeRow, otherRowProps, innerContext ,test) {
    return (
      <BCard title={activeRow.name} expandable={false} expanded={activeRow.expanded}
          context={this.context}
          style={{marginTop:24, marginRight:24, marginLeft:24}}
          // onExpandChange={(expa)=>{
          //   activeRow.expanded=expa;
          //   // test.recomputeRowHeights(0);

          //   setTimeout(function(){
          //     //test.cache.clear (otherRowProps.index, 0)
          //     test.cache.clearAll();
          //     test.list.forceUpdateGrid();
          //   }, 200);
          // }}

          >
        <div>{activeRow.about} </div>
      </BCard>
    );
  }



  _btnDisableOnclick() {
    this.disabled = !this.disabled;
    this.BaseFormComponent.setDisable(this.disabled);
    // this.GridSectionComponent.setDisable(this.disabled);
  }

  onActionClick() {
    // alert(this.snaps.temp.getValue());
    this.disableAction('GetInfo');
  }

  generate(context) {
    this.context=context;
    var resourceInfo = {
      id: 184,
      name: 'Nakit Yatırma',
      iconPath: '',
      sortId: 3,
      isHidden: false,
      isLeaf: true,
      description: 'Nakit Yatırma Listesi Ekranı',
      assemblyName: 'BOA.UI.CoreBanking.Teller.DepositWithdrawalList',
      className: 'BOA.UI.CoreBanking.Teller.DepositWithdrawalList',
      channelId: 1,
      uiType: 1,
      resourceActionList: [
        {
          resourceId: 184,
          actionId: 11,
          name: 'Bilgi Getir',
          commandName: 'GetInfo',
          description: 'Bilgi Getir',
          iconPath: 'ActionList',
          sortId: 1
        },
        {
          resourceId: 184,
          actionId: 11,
          name: 'Temizle',
          commandName: 'Clean',
          description: 'Temizle',
          iconPath: 'ActionList',
          sortId: 1
        },
        {
          resourceId: 184,
          actionId: 11,
          name: 'Yazdır',
          commandName: 'Print',
          description: 'Yazdır',
          iconPath: 'ActionList',
          sortId: 1
        }
      ],
      openedBy: 0,
      isWorkflow: false,
      isRevokable: false,
      resourceCode: 'TMBRNKLIST',
      moduleCode: 'Gişe İşlemleri',
      isNew: false
    };

    this.snaps = {};

    this.tabs = [
      {
        text: 'Kişi Bilgileri',
        value: '0',
        key: 0,
        content: <div><BCard
          title='deneme'
          column={0}
          context={context}>
          <div>
            1.tab
          </div>
        </BCard>
        </div>
      },
      {
        text: 'İlişkiler',
        value: '0',
        key: 1,
        content: <div><BCard
        title='deneme'
          column={1}
          context={context}>
          <div>
            2.tab
          </div>
        </BCard>
        </div>
      }
    ];

    this.leftPaneContent = (<BCard
      title='deneme'
      ref={(r) => this.BCardComponent = r}
      column={0}
      context={context}
      disabled={this.disabled}
      expandable={true}
      expanded={true}>
      <div>
        <BInput context={context} ref={r => this.snaps.temp = r} value="deneme" />
        <button id="disable" onClick={this._btnDisableOnclick.bind(this)} style={{ marginLeft: '10px' }}>Disable/Editable</button>
      </div>
    </BCard>);
    return [
      {
        'text': 'BBrowseForm',
        'component':
  <div style={{ height: 500, minWidth: 700 }}>
    <BBrowseForm
              ref={(r) => this.BaseFormComponent = r}
              context={context}
              resourceInfo={resourceInfo}
              dataSource={this.dataSource}
              columns={this.columns}
              onActionClick={this.onActionClick.bind(this)}
              // hideCriteriaPanel={true}
              >
      {this.leftPaneContent}
    </BBrowseForm>
  </div>
      },
      {
        'text': 'BTransactionForm',
        'component':
  <div style={{ height: 500, minWidth: 700 }}>
    <BTransactionForm
              context={context}
              resourceInfo={resourceInfo}
              leftPaneContent={this.leftPaneContent}>
      <BCard
              title='deneme'
                ref={(r) => this.BCardComponent2 = r}
                column={0}
                context={context}
                disabled={this.disabled}
                expandable={true}
                expanded={true}>
        <div>
          <BInput context={context} />
          <button id="disable" onClick={this._btnDisableOnclick.bind(this)} style={{ marginLeft: '10px' }}>Disable/Editable</button>
        </div>
      </BCard>
      <BCard
              title='deneme'
                ref={(r) => this.BCardComponent3 = r}
                column={0}
                context={context}
                disabled={this.disabled}
                expandable={true}
                expanded={true}>
        <div>
          <BInput context={context} />
          <button id="disable" onClick={this._btnDisableOnclick.bind(this)} style={{ marginLeft: '10px' }}>Disable/Editable</button>
        </div>
      </BCard>
    </BTransactionForm>
  </div>
      },
      {
        'text': 'BTransactionFormTabs',
        'component':
  <div style={{ height: 500, minWidth: 700 }}>
    <BTransactionForm
              context={context}
              resourceInfo={resourceInfo}
              tabEnabled={true}>
      {this.tabs}
    </BTransactionForm>
  </div>
      },
      {
        'text': 'BTransactionFormWide',
        'component':
  <div style={{ height: 500, minWidth: 700 }}>
    <BTransactionForm
              context={context}
              resourceInfo={resourceInfo}
              cardSectionThresholdColumn={1}
              tabEnabled={true}>
      {this.tabs}
    </BTransactionForm>
  </div>
      },

      {
        'text': 'BBrowseForm With Virtualized List',
        'component':
  <div style={{ height: 500, minWidth: 700 }}>
    <BBrowseForm
              ref={(r) => this.BaseFormComponent = r}
              context={context}
              resourceInfo={resourceInfo}
              dataSource={this.dataSource}
              columns={this.columns}
              onActionClick={this.onActionClick.bind(this)}
              isRenderCustomRow={true}
              rowRenderer={this.rowRenderer.bind(this)}
              customRowProperties={{
                estimatedRowSize: 100,
                overscanRowCount:5
              }}
              >
      {this.leftPaneContent}
    </BBrowseForm>
  </div>
      },
    ];
  }
}
export default BFormBaseTestGenerator;
