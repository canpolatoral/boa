import React from 'react';
import { BCard } from 'b-card';
import { BTransactionForm } from 'b-transaction-form';
import { BButton } from 'b-button';
import { BHtmlToReact } from 'b-html-to-react';
import { BInput } from 'b-input';
import { BComponent } from 'b-component';

export class BCardTestGenerator {
  constructor() {
    this.disabled = false;
  }

  _btnDisableOnclick() {
    this.disabled = !this.disabled;
    this.BCardComponent.setDisable(this.disabled);
  }

  _onclick() {
    alert('ses deneme');
  }

  onActionClick(command: any) {
    switch (command.commandName) {
      case 'GetInfo': {
        BComponent.FormManager.showStatusMessage('zeynep - snack-bar');
        break;
      }
      case 'Save': {
        BComponent.FormManager.showStatusMessage('zeynep - snack-bar', 'Button');
        break;
      }
      case 'Clean': {
        BComponent.FormManager.showStatusMessage('zeynep - snack-bar', 'Button2', this._onclick);
        break;
      }
      default:
        break;
    }
  }

  onButtonClicked() {
    BComponent.FormManager.showStatusMessage('actionButton');
  }
  generate(context) {

    var rawHtml = '<div>deneme 1-2</div>';

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
          text: 'Ekle',
          sortId: 1
        },
        {
          resourceId: 185,
          actionId: 12,
          name: 'Kaydet',
          commandName: 'Save',
          description: 'Bilgi Getir',
          iconPath: 'ActionList',
          text: 'Kaydet',
          sortId: 1
        },
        {
          resourceId: 186,
          actionId: 13,
          name: 'Temizle',
          commandName: 'Clean',
          description: 'Bilgi Getir',
          iconPath: 'ActionList',
          text: 'Temizle',
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
    return [
      {
        'text': 'Card',
        'component': <div style={{ height: 650 }} >
          <BTransactionForm enableCardSortOnMobile={true} context={context} onActionClick={this.onActionClick.bind(this)} resourceInfo={resourceInfo}>
            <BCard context={context}
              column={0}
              expandable={true}
              title={'test'}
              mobileSortOrder={this.test ? this.test.getInstance().getValue() : 0}
            >
              <BInput value={0} context={context} ref={r => this.test = r} />
              <div>icerik</div>
              <BHtmlToReact html={rawHtml} />
            </BCard>
            <BCard context={context}
              column={1}
              expandable={false}
              title={'test2'}
              mobileSortOrder={this.test2 ? this.test2.getInstance().getValue() : 1}
            >
            </BCard>
            <BCard context={context}
              column={0}
              expandable={true}
              mobileSortOrder={1}
              title={'test3'}
              // actionList={[{ dynamicIcon: 'AddCircleOutline', iconProperties: { color: context.theme.boaPalette.pri500 }, onClick: null }, { dynamicIcon: 'AddCircleOutline', iconProperties: { color: context.theme.boaPalette.pri500 }, onClick: null }]}
              mobileSortOrder={this.test3 ? this.test3.getInstance().getValue() : 2}
            >
              <BInput value={2} floatingLabelText='MobilSortOrder' context={context} ref={r => this.test3 = r} />
              <div>icerik</div>
            </BCard>
            <BCard context={context}
              column={1}
              expandable={true}
              title={'test4'}
              mobileSortOrder={this.test4 ? this.test4.getInstance().getValue() : 3}
            >
              <BInput value={3} floatingLabelText='MobilSortOrder' context={context} ref={r => this.test4 = r} />
              <div>icerik</div>

            </BCard>

            <BCard context={context}
              column={0}
              expandable={true}
              mobileSortOrder={1}
              title={'actionHeaderContent Test'}
              showAddButton={true}
              addButtonText={'Add'}
              historyButtonText={'History'}
              showHistoryButton={true}
              showDeleteButton={true}
              showEditButton={true}
              actionHeaderContent={<BButton context={context} />}
              onAddClicked={this.onButtonClicked.bind(this)}
              onEditClicked={this.onButtonClicked.bind(this)}
              onDeleteClicked={this.onButtonClicked.bind(this)}
              onHistoryClicked={this.onButtonClicked.bind(this)}
              mobileSortOrder={this.test3 ? this.test3.getInstance().getValue() : 2}
            >
            </BCard>

            <BCard

              context={context}
              expandable={false}
              hasMedia={true}
              style={{ width: 300, minHeight: 320, margin: 10 }}
              cardTitle={'Accounts MobilSortOrder : 4'}

              cardText={'Kuveyt Turk, Turkeys leading and innovative participation bank, with the cooperation of Workinton, has established the Lonca Entrepreneurship Center, where training, mentoring, financial support, consulting and many other opportunities are offered. Thanks to the partnership done with Workinton, Lonca Entrepreneurship Center, will serve startup in different locations offering many opportunities such as incubation, acceleration program and financial investment support.'}
              mediaImage={'https://developer.kuveytturk.com.tr/images/news3.png'}
              mobileSortOrder={this.test5 ? this.test5.getInstance().getValue() : 4}
            >
              <BInput value={4} floatingLabelText='MobilSortOrder' context={context} ref={r => this.test5 = r} />
            </BCard>
            <BCard context={context}
              column={1}
              expandable={false}
              headerContent={<BButton context={context}
                type="flat"
                text="Default"
                style={{ marginRight: '10px' }}
              />}
              title={'test5'}
              mobileSortOrder={this.test6 ? this.test6.getInstance().getValue() : 5}
            >
              <BInput value={5} floatingLabelText='MobilSortOrder' context={context} ref={r => this.test6 = r} />
              <div>icerik</div>
            </BCard>
            <BCard context={context}
              title={'test6'}
              column={1}
              expandable={true}
              mobileSortOrder={this.test7 ? this.test7.getInstance().getValue() : 6}
            >
              <BInput value={6} floatingLabelText='MobilSortOrder' context={context} ref={r => this.test7 = r} />
              <div>icerik</div>
            </BCard>
            <BCard context={context}
              headerContent={'icerik'}
              column={1}
              expandable={true}
              mobileSortOrder={this.test8 ? this.test8.getInstance().getValue() : 7}
            >
              <BInput value={7} floatingLabelText='MobilSortOrder' context={context} ref={r => this.test8 = r} />
              <div>icerik</div>
            </BCard>
            <BCard context={context}
              title={'test8'}
              column={1}
              expandable={false}
              mobileSortOrder={this.test9 ? this.test9.getInstance().getValue() : 8}
            >
              <BInput value={8} floatingLabelText='MobilSortOrder' context={context} ref={r => this.test9 = r} />
              <div>icerik</div>
            </BCard>
            <BCard context={context}
              title={'test9'}
              column={1}
              headerContent={<BButton context={context}
                type="flat"
                text="Default"
                style={{ marginRight: '10px' }}
              />}
              expandable={false}

              mobileSortOrder={this.test10 ? this.test10.getInstance().getValue() : 9}
            >
              <BInput value={9} floatingLabelText='MobilSortOrder' context={context} ref={r => this.test10 = r} />
              <div>icerik</div>
            </BCard>
          </BTransactionForm>
        </div>
      }
    ];
  }
}
export default BCardTestGenerator;

