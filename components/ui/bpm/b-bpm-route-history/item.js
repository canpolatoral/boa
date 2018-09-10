import React from 'react'; import PropTypes from 'prop-types';
// import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import AccessTime from '@material-ui/icons/AccessTime';
import Cancel from '@material-ui/icons/Cancel';
import NotInterested from '@material-ui/icons/NotInterested';
import UIHelper from './ui-helper';
import BRouteHistoryExpandableItem from './expandable-item';

import { BComponent, BComponentComposer } from 'b-component';
import { BLocalization } from 'b-localization';
import { BFlexPanel } from 'b-flex-panel';
import { BIconButton } from 'b-icon-button';
import { AuthorizedUserDialog } from 'b-authorized-user-dialog';

var SkypeLogo = require('b-icon').Logos.SkypeLogo;
var User = require('b-icon').Others.User;
var SupervisorAccount = require('b-icon').Others.SupervisorAccount;
var CheckCircleOutline = require('b-icon').Others.CheckCircleOutline;
@BComponentComposer
export class BRouteHistoryItem extends BComponent {
  static propTypes = {
    ...BComponent.propTypes,
    historyItem: PropTypes.any,
    dividerVisibility: PropTypes.bool,
    form: PropTypes.any,
    settingContract: PropTypes.any,
    isExpanded: PropTypes.bool
  };

  static defaultProps = {
    ...BComponent.defaultProps
  };

  constructor(props, context) {
    super(props, context);
  }

  getStateIcon() {
    var icon = {};
    switch (this.props.historyItem.itemStatus) {
      case UIHelper.ItemStatus.APPROVED:
        {
          icon =
            (
              <CheckCircleOutline
                style={{ alignSelf: 'center' }}
                context={this.props.context}
                nativeColor={this.getHeaderTextStye().color}   >
              </CheckCircleOutline>
            );
          break;
        }

      case UIHelper.ItemStatus.REJECTED:
        {
          icon =
            (
              <Cancel
                style={{ alignSelf: 'center' }}
                context={this.props.context}
                nativeColor={this.getHeaderTextStye().color}  >
              </Cancel>
            );
          break;
        }
      case UIHelper.ItemStatus.WORKING:
        {
          icon =
            (
              <AccessTime
                style={{ alignSelf: 'center' }}
                context={this.props.context}
                nativeColor={this.getHeaderTextStye().color}   >
              </AccessTime>
            );
          break;
        }
      case UIHelper.ItemStatus.NOTSTARTED:
        {
          icon =
            (
              <AccessTime
                style={{ alignSelf: 'center' }}
                context={this.props.context}
                nativeColor={this.getHeaderTextStye().color}   >
              </AccessTime>
            );
          break;
        }
      case UIHelper.ItemStatus.USERDIDNOTACTION:
        {
          icon =
            (
              <NotInterested
                style={{ alignSelf: 'center' }}
                context={this.props.context}
                nativeColor={this.getHeaderTextStye().color}   >
              </NotInterested>
            );
          break;
        }
      default:
        {
          icon =
            (
              <AccessTime
                style={{ alignSelf: 'center' }}
                context={this.props.context}
                nativeColor={this.getHeaderTextStye().color}   >
              </AccessTime>
            );
          break;
        }
    }

    return icon;
  }

  openAuthorizedDialog() {
    AuthorizedUserDialog.showAuthorizedUser(this.props.context, this.props.historyItem.instanceStateId);
  }

  isPool() {
    if (this.props.historyItem
      && this.props.historyItem.stateEndDate == null
      && (this.props.historyItem.userCode == '' || this.props.historyItem.userCode == null))
      return true;
    else return false;
  }

  getUserImage() {
    var imgDivStyle = {
      width: '58px',
      height: '58px',
      borderWidth: 1,
      borderRadius: '50%',
      borderStyle: 'solid',
      borderColor: this.props.context.theme.boaPalette.base150,
      objectFit: 'cover',
      objectPosition: 'Top'
    };
    var imgStyle = {
      width: '56px',
      height: '56px'
    };
    var imgUser;
    // havuzdaki işlemler
    if (this.isPool()) {
      imgUser =
        (

          <div style={imgDivStyle}
            onClick={this.openAuthorizedDialog.bind(this)}>

            <SupervisorAccount
              style={Object.assign({
                cursor: 'pointer'
              }, imgStyle)}
              context={this.props.context}
              nativeColor={this.props.context.theme.boaPalette.pri500} />

          </div>
        );
      return imgUser;
    }
    else {
      var imageSource;
      // kullanıcı resmi var
      if (this.props.historyItem.userImage) {
        imageSource = 'data:image/jpeg;base64,' + this.props.historyItem.userImage;
        return (
          <div >
            <img src={imageSource} style={imgDivStyle} />
          </div>
        );
      }
      // kullanıcı resmi yok
      else {
        return (
          <div style={imgDivStyle}>
            <User
              style={imgStyle}
              context={this.props.context}
              nativeColor={this.props.context.theme.boaPalette.base250} />
          </div>

        );
      }
    }
  }

  getContentVisibility() {
    return (this.props.historyItem.itemType == 2 || this.props.historyItem.stateStartDate == null) ? false : true;
  }

  getHeaderTextStye() {
    var color;
    switch (this.props.historyItem.itemStatus) {
      case UIHelper.ItemStatus.APPROVED:
        {
          color = this.props.context.theme.boaPalette.success500;
          break;
        }
      case UIHelper.ItemStatus.REJECTED:
        {
          color = this.props.context.theme.boaPalette.error500;
          break;
        }
      case UIHelper.ItemStatus.WORKING:
        {
          color = this.props.context.theme.boaPalette.info500;
          break;
        }
      case UIHelper.ItemStatus.NOTSTARTED:
        {
          color = this.props.context.theme.boaPalette.base250;
          break;
        }
      case UIHelper.ItemStatus.USERDIDNOTACTION:
        {
          color = this.props.context.theme.boaPalette.base400;
          break;
        }
      default:
        color = this.props.context.theme.boaPalette.base400;
        break;
    }
    var stye = {
      color: color,
      fontWeight: '500',
      marginTop: '0px',
      fontSize: '16px',
      width: '100%',
      direction: !this.props.context.localization.isRightToLeft ? 'ltr' : 'rtl'
    };
    return stye;
  }

  getDividerVisibility() {
    if (this.props.dividerVisibility != null) { // prop verilmişse o kullanılacak
      return this.props.dividerVisibility;
    }
    else if (this.props.historyItem.itemType == 2) { // kapanış
      return false;
    }
    else return true;
  }

  render() {

    var simpleDate;
    if (this.props.historyItem.userEndDate != null) {
      simpleDate = this.props.historyItem.userEndDate;
    }
    else if (this.props.historyItem.stateStartDate != null) {
      simpleDate = this.props.historyItem.stateStartDate;
    }
    if (simpleDate != null) {
      simpleDate = BLocalization.formatDateTime(this.props.historyItem.stateStartDate, 'LLL');
    }
    return (


      <BFlexPanel
        /** root */
        style={{}}
        alignment='left'
        isReverse={!this.props.context.localization.isRightToLeft ? false : true}
        direction='horizontal'
        alignItems='stretch'
        responsive={false}
        context={this.props.context}>

        <BFlexPanel
          /** icon and divider */
          style={{}}
          alignment='left'
          direction='vertical'
          responsive={false}
          alignment='spaceBetween'
          context={this.props.context}>
          { /** durum ikonu */
            this.getStateIcon()
          }
          { /** divider */
            <div style={{
              width: '1px',
              display: this.getDividerVisibility() == false ? 'none' : '',
              background: this.props.context.theme.boaPalette.base200,
              alignSelf: 'center',
              flexGrow: '1',
              marginBottom: -2,
              marginTop: -2
            }} >
            </div>
          }
        </BFlexPanel>

        <BFlexPanel
          /** başlık ve içerik */
          style={{
            marginLeft: !this.props.context.localization.isRightToLeft ? '12px' : '0px',
            marginRight: !this.props.context.localization.isRightToLeft ? '0px' : '12px',
            marginBottom: 12
          }}
          alignment='left'
          direction='vertical'
          alignItems={!this.props.context.localization.isRightToLeft ? 'left' : 'right'}
          responsive={false}
          alignment='spaceBetween'
          context={this.props.context}>
          <div /** başlık */
            style={this.getHeaderTextStye()} >
            {this.props.historyItem.name}
          </div>
          <div style={{ display: this.getContentVisibility() == false ? 'none' : '' }}>
            <BFlexPanel
              /** fotoğraf ve içerik */
              style={{
                marginTop: 10,
                marginBottom: 20,
                alignSelf: !this.props.context.localization.isRightToLeft ? 'left' : 'right',
                flexGrow: '1'
              }}
              alignment='left'
              isReverse={!this.props.context.localization.isRightToLeft ? false : true}
              direction='horizontal'
              alignItems='stretch'
              responsive={false}
              context={this.props.context}>
              {/* fotoğraf */}
              {this.getUserImage()}
              <BFlexPanel
                /** içerik */
                style={{
                  marginLeft: !this.props.context.localization.isRightToLeft ? 12 : 0,
                  marginRight: !this.props.context.localization.isRightToLeft ? 0 : 12,
                  marginTop: -4
                }}
                alignment='left'
                direction='vertical'
                alignItems={!this.props.context.localization.isRightToLeft ? 'left' : 'right'}
                responsive={false}
                context={this.props.context}>
                {
                  /* kullanıc adı, çalışma grubu, havuzda */
                  this.isPool() == false ?
                    (
                      <BFlexPanel
                        isReverse={!this.props.context.localization.isRightToLeft ? false : true}
                        style={{
                          marginBottom: 0,
                          marginTop: 0,
                          minHeight: 22,
                          width: '100%'
                        }}>
                        <span style={{
                          color: this.props.context.theme.boaPalette.base450,
                          fontSize: 14
                        }}
                        >
                          {this.props.historyItem.userName}
                        </span>

                        <span style={{
                          color: this.props.context.theme.boaPalette.base300,
                          fontSize: 14,
                          marginLeft: 5,
                          marginRight: 5,
                        }}
                        >
                          -
                        </span>

                        <span style={{
                          color: this.props.context.theme.boaPalette.base300,
                          fontSize: 14
                        }}
                        >
                          {this.props.historyItem.workgroupName}
                        </span>
                      </BFlexPanel>

                    ) :
                    (
                      <div
                        onClick={this.openAuthorizedDialog.bind(this)}
                        style={{
                          color: this.props.context.theme.boaPalette.pri500,
                          fontSize: 14,
                          fontWeight: '700',
                          cursor: 'pointer',
                          width: '100%',
                          direction: !this.props.context.localization.isRightToLeft ? 'ltr' : 'rtl'
                        }} >{this.getMessage('Workflow', 'ThePool')}</div>
                    )
                }
                {/* kronolojik sıralamadaki işlem türü alanı */}
                <div style={{
                  display: this.props.historyItem.flowName == null ? 'none' : '',
                  minHeight: 22
                }}>
                  {
                    UIHelper.generateTextInfo(this.props.context, this.getMessage('BOAOne', 'Function'), this.props.historyItem.flowName)
                  }
                </div>
                <div style={{ width: '100%', display: (this.isPool() == true || this.props.historyItem.userCode == 'EODUser') ? 'none' : '' }}>
                  <BFlexPanel
                    /** VOIP, mail, skype*/
                    alignment='left'
                    isReverse={!this.props.context.localization.isRightToLeft ? false : true}
                    direction='horizontal'
                    alignItems='stretch'
                    responsive={false}
                    context={this.props.context}
                    style={{
                      minHeight: 22
                    }}>

                    <p style={{
                      display: this.props.historyItem.voip ? '' : 'none',
                      marginBottom: 0,
                      marginTop: 0,
                      minHeight: 22
                    }}>
                      <span style={{
                        color: this.props.context.theme.boaPalette.base300,
                        fontSize: 12
                      }}
                      >
                        VOIP
                      </span>

                      <span style={{
                        color: this.props.context.theme.boaPalette.base300,
                        fontSize: 12,
                        marginLeft: !this.props.context.localization.isRightToLeft ? 5 : 0,
                        marginRight: !this.props.context.localization.isRightToLeft ? 5 : 0,
                      }}
                      >
                        :
                      </span>
                      <span style={{
                        color: this.props.context.theme.boaPalette.pri500,
                        fontSize: 14,
                        fontWeight: 700
                      }}
                      >
                        {this.props.historyItem.voip}
                      </span>
                    </p>


                    <BIconButton
                      iconProperties={{
                        nativeColor: this.props.context.theme.boaPalette.pri500,
                        height: 20,
                        width: 20
                      }}
                      context={this.props.context}
                      dynamicIcon='Email'
                      tooltip={this.getMessage('BOAOne', 'SendMail')}
                      style={{
                        marginTop: -14,
                        marginBottom: -14,
                        marginLeft: (this.props.historyItem.voip != null && this.props.historyItem.voip == '') && !this.props.context.localization.isRightToLeft ? -14 : 0,
                        marginRight: !((this.props.historyItem.voip != null && this.props.historyItem.voip == '') && !this.props.context.localization.isRightToLeft ? 0 : -14),
                        display: this.props.context.applicationContext.isBOALogin ? 'none' :  // TODO: container lin yönlendirmelerini desteklemediği için, daha sonra eklenecek...
                          ((this.props.historyItem.email != null && this.props.historyItem.email == '') ? 'none' : '')
                      }}
                      onClick={() => {
                        if (this.props.context.applicationContext.isBOALogin == true) {
                          window.open('mailto:' + this.props.historyItem.email);
                        }
                        else {
                          window.location.href = 'mailto:' + this.props.historyItem.email;

                        }
                      }}
                    />
                    <BIconButton
                      iconProperties={{
                        nativeColor: this.props.context.theme.boaPalette.info500,
                        height: 20,
                        width: 20
                      }}
                      visible={false}
                      context={this.props.context}
                      icon={<SkypeLogo context={this.props.context} />}
                      style={{
                        display: 'none',
                        marginTop: -14,
                        marginLeft: !this.props.context.localization.isRightToLeft ? -14 : 0,
                        marginRight: !this.props.context.localization.isRightToLeft ? 0 : -14,
                        marginBottom: -14, // TODO: konuşma başlat için yukarıdak, display kaldırılacak
                        // display: (this.props.historyItem.userCode == null
                        // || this.props.historyItem.userCode == '') ? 'none' : ''
                      }}
                      tooltip={this.getMessage('BOAOne', 'StartSpeech')} />
                  </BFlexPanel>
                </div>
                {/* detayları göster seçilmiş ise bu alanlar görüntülenecek */}
                <div style={{
                  display: this.props.settingContract.showDetail == 0 ? 'none' : '',
                  minHeight: 22
                }}>
                  {/* aksiyon */}
                  <div style={{
                    display: (this.props.historyItem.actionName == null || this.props.historyItem.actionName == '') ? 'none' : '',
                    minHeight: 22
                  }}>
                    {
                      UIHelper.generateTextInfo(this.props.context, this.getMessage('Workflow', 'WFLAction'), this.props.historyItem.actionName)
                    }
                  </div>
                  {/* durum */}
                  <div style={{
                    display: (this.props.historyItem.statusName == null || this.props.historyItem.statusName == '') ? 'none' : '',
                    minHeight: 22
                  }}>
                    {
                      UIHelper.generateTextInfo(this.props.context, this.getMessage('BusinessComponents', 'Condition'), this.props.historyItem.statusName)
                    }
                  </div>
                  {/* Başlangıç tarihi*/}
                  <div style={{
                    display: this.props.historyItem.stateStartDate == null ? 'none' : '',
                    minHeight: 22
                  }}>
                    {
                      UIHelper.generateTextInfo(this.props.context, this.getMessage('Workflow', 'WFLStartNode'), BLocalization.formatDateTime(this.props.historyItem.stateStartDate, 'LLL'))
                    }
                  </div>
                  {/* Atanma tarihi*/}
                  <div style={{
                    display: this.props.historyItem.userStartDate == null ? 'none' : '',
                    minHeight: 22
                  }}>
                    {
                      UIHelper.generateTextInfo(this.props.context, this.getMessage('BOAOne', 'Designation'), BLocalization.formatDateTime(this.props.historyItem.userStartDate, 'LLL'))
                    }
                  </div>
                  {/* Bitiş tarihi*/}
                  <div style={{
                    display: this.props.historyItem.userEndDate == null ? 'none' : '',
                    minHeight: 22
                  }}>
                    {
                      UIHelper.generateTextInfo(this.props.context, this.getMessage('Workflow', 'WFLEndNode'), BLocalization.formatDateTime(this.props.historyItem.userEndDate, 'LLL'))
                    }
                  </div>
                </div>
                {/* detayları göster seçilmemiş ise atanma veya bitiş tarihi görünecek */}
                <div style={{
                  display: this.props.settingContract.showDetail == 1 ? 'none' : '',
                  minHeight: 22
                }}>
                  {
                    UIHelper.generateTextInfo(this.props.context, this.props.historyItem.stateEndDate == null ? this.getMessage('BOAOne', 'Designation') : this.getMessage('Workflow', 'WFLEndNode'), simpleDate)
                  }
                </div>
                {/* alt durum için kullanıcı notu */}
                <div style={{
                  display: this.props.historyItem.description == null || this.props.historyItem.description == '' ? 'none' : ''
                }}>
                  {
                    UIHelper.generateTextInfo(this.props.context, this.getMessage('BOAOne', 'UserNote'), this.props.historyItem.description)
                  }
                </div>

              </BFlexPanel>
            </BFlexPanel>

            {
              (this.props.historyItem.isAddedSubState === true &&
               this.props.historyItem.firstSubState &&
               this.props.historyItem.firstSubState.itemTypeName) ? (<BRouteHistoryExpandableItem
                  context={this.props.context}
                  historyItem={this.props.historyItem.firstSubState}
                  historyItemList={this.props.historyItem.subStateList}
                  itemTypeName={this.props.historyItem.firstSubState.itemTypeName}
                  form={this.props.form}
                  isExpanded={this.props.isExpanded}
                  settingContract={this.props.settingContract} />) : (<div></div>)
            }

          </div>
          <div
            style={{
              display: this.getContentVisibility() == false ? 'block' : 'none',
              height: 28
            }}>
          </div>

        </BFlexPanel>
      </BFlexPanel>

    );
  }
}
export default BRouteHistoryItem;
