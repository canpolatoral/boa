import React from 'react'; import PropTypes from 'prop-types';
import BRouteHistoryItem from './item';
import UIHelper from './ui-helper';


import { BComponentComposer } from 'b-component';
import { BBusinessComponent } from 'b-business-component';
import { BFlexPanel } from 'b-flex-panel';
import { BLabel } from 'b-label';
import { BIconButton } from 'b-icon-button';
import { BProgress } from 'b-progress';

@BComponentComposer
export class BRouteHistoryExpandableItem extends BBusinessComponent {
  static propTypes = {
    ...BBusinessComponent.propTypes,
    historyItem: PropTypes.any,
    itemTypeName: PropTypes.string,
    form: PropTypes.any,
    isExpanded: PropTypes.bool,
    settingContract: PropTypes.any,
    historyItemList: PropTypes.any,
    dividerVisibility: PropTypes.bool
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps
  };

  constructor(props, context) {
    super(props, context);

  }

  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'GetAllRouteHistory':
        if (response.success) {
          var allHistoryList = response.value.historyList;
          // allHistoryList = _.sortBy(allHistoryList, 'orderNumber');
          let historyList = UIHelper.populateHistoryItems(allHistoryList, this.props.form, this.props.isExpanded, this.props.settingContract);
          this.setState({
            historyList: historyList,
            isLoading: false,
            isExpanded: true
          });
        }
        else {
          // eslint-disable-next-line no-console
          console.log(response);
          // eslint-enable-next-line no-console
        }
        break;
      default:
        break;
    }
  }

  getHistoryList(instanceId: number) {

    let proxyRequest = {
      requestClass: 'BOA.Types.BPM.RouteHistoryRequest',
      requestBody: {
        methodName: 'GetAllRouteHistory',
        instanceId: instanceId,
        resourceId: this.props.resourceInfo && this.props.resourceInfo.id ? this.props.resourceInfo.id : 153,
        actionId: 11
      },
      key: 'GetAllRouteHistory'
    };
    this.proxyExecute(proxyRequest);
  }

  generateTextInfo(label, info) {
    if (info == '' || info == undefined) {
      info = '-';
    }
    var labelStyle = {
      fontSize: '12px',
      color: this.props.context.theme.boaPalette.base300
    };
    var infoStyle = {
      fontSize: '14px',
      marginLeft: !this.props.context.localization.isRightToLeft ? '5px' : '0px',
      marginRight: !this.props.context.localization.isRightToLeft ? '0px' : '5px',
      color: this.props.context.theme.boaPalette.base450
    };

    var returnInfo =
      (
        <BFlexPanel
          alignment='left'
          isReverse={!this.props.context.localization.isRightToLeft ? false : true}
          direction='horizontal'
          alignItems='left'
          responsive={false}
          context={this.props.context}>
          <BLabel context={this.props.context} style={labelStyle} text={label}></BLabel>
          <BLabel context={this.props.context} style={labelStyle} text=': '></BLabel>
          <BLabel context={this.props.context} style={infoStyle} text={info}></BLabel>
        </BFlexPanel>
      );
    return returnInfo;
  }

  getStateIcon() {
    var returnObject;
    var iconName;
    if (this.state && this.state.isLoading) {
      returnObject =
        (
          <BProgress left={0} top={0} context={this.props.context} size={24} status='loading' />
        );
      return returnObject;
    }

    if (this.state && this.state.isExpanded == true) {
      iconName = 'IndeterminateCheckBox';
    }
    else {
      iconName = 'AddBox';
    }


    returnObject =
      (
        <BIconButton
          disabled={this.props.historyItem.stateStartDate == null ? true : false}
          iconProperties={{
            nativeColor: this.props.context.theme.boaPalette.info500
          }}
          context={this.props.context}
          dynamicIcon={iconName}
          style={{ margin: '-12px -12px' }}
          onClick={() => {
            if (this.state.isExpanded == false) {
              if (this.props.historyItem.itemType == 7) {
                let historyList = UIHelper.populateHistoryItems(this.props.historyItemList, this.props.form, this.props.isExpanded, this.props.settingContract);
                this.setState({
                  historyList: historyList,
                  isLoading: false,
                  isExpanded: true
                });
              }
              else {
                this.getHistoryList(this.props.historyItem.instanceId);
                this.setState({ isLoading: true });
              }
            }
            else {
              this.createFirstItem();
            }

          }} />
      );

    return returnObject;
  }

  createFirstItem() {
    let uniqueKey = this.props.historyItem.orderNumber;
    var item = (
      <BRouteHistoryItem
        context={this.props.context}
        historyItem={this.props.historyItem}
        key={uniqueKey}
        dividerVisibility={false}
        settingContract={this.props.settingContract}
      />
    );

    this.setState({
      historyList: item,
      isLoading: false,
      isExpanded: false
    });
  }

  getUserImage() {

    var imageSource;
    if (this.props.historyItem.userImage) {
      imageSource = 'data:image/jpeg;base64,' + this.props.historyItem.userImage;
    }
    var imgUser = imageSource != null ? (
      <img src={imageSource} style={{ width: '56px', height: '56px', objectFit: 'cover', objectPosition: 'Top'}} />) :
      (<div style={{ width: '56px', height: '56px', background: this.props.context.theme.boaPalette.base200 }} ></div>);
    return imgUser;
  }

  getContentVisibility() {
    // return (this.props.historyItem.itemType==2 || this.props.historyItem.stateStartDate==null  ) ? false:true;
    return true;
  }

  getHeaderTextStye() {

    var textColor;
    var backgroundColor;

    if (this.props.historyItem.itemType == 5) { // alt süreç

      backgroundColor = this.props.context.theme.boaPalette.badgePurpleLight;
      textColor = this.props.context.theme.boaPalette.badgePurple;

    }
    else if (this.props.historyItem.itemType == 6) { // ilişkiki süreç
      backgroundColor = this.props.context.theme.boaPalette.badgeOrangeLight;
      textColor = this.props.context.theme.boaPalette.badgeOrange;
    }
    else if (this.props.historyItem.itemType == 7) { // TODO:  alt durum

      backgroundColor = this.props.context.theme.boaPalette.badgeTealLight;
      textColor = this.props.context.theme.boaPalette.badgeTeal;
    }

    // disabled
    if (this.props.historyItem.stateStartDate == null) {
      textColor = this.props.context.theme.boaPalette.base400;
    }

    var style = {
      color: textColor,
      fontWeight: '700',
      background: backgroundColor,
      height: 22,
      paddingLeft: 8,
      paddingRight: 8,
      borderRadius: 2,
      fontSize: 13,
      paddingTop: 2,
      display: 'inline-table',
      marginTop: 1
    };
    return style;
  }

  componentWillMount() {
    super.componentWillMount();
    if (this.props.isExpanded) {
      if (this.props.historyItem.itemType == 7) {
        let historyList = UIHelper.populateHistoryItems(this.props.historyItemList, this.props.form, this.props.isExpanded, this.props.settingContract);
        this.setState({
          historyList: historyList,
          isLoading: false,
          isExpanded: true
        });
      }
      else {
        this.getHistoryList(this.props.historyItem.instanceId);
        this.setState({ isLoading: true });
      }
    }
    else {
      this.createFirstItem();
    }
  }

  render() {

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
          alignItems={!this.props.context.localization.isRightToLeft ? 'left' : 'right'}
          responsive={false}
          alignment='spaceBetween'
          context={this.props.context}>
          { /** durum ikonu */
            this.getStateIcon()
          }
          { /** divider */
            <div style={{
              width: '1px',
              display: this.props.historyItem.itemType == 7 ? 'none' : '',
              background: this.props.context.theme.boaPalette.base200,
              alignSelf: 'center',
              flexGrow: '1'
            }} >
            </div>
          }
        </BFlexPanel>

        <BFlexPanel
          /** başlık ve içerik */
          style={{
            marginLeft: !this.props.context.localization.isRightToLeft ? '12px' : '0px',
            marginRight: !this.props.context.localization.isRightToLeft ? '0px' : '12px'
          }}
          direction='vertical'
          alignment='left'
          responsive={false}
          alignment='spaceBetween'
          context={this.props.context}>
          <div style={{ direction: !this.props.context.localization.isRightToLeft ? 'ltr' : 'rtl' }}>
            <span /** başlık */
              style={this.getHeaderTextStye()} >
              {this.props.itemTypeName}
            </span>
          </div>

          <div style={{ display: this.getContentVisibility() == false ? 'none' : '' }}>
            <BFlexPanel
              /** fotoğraf ve içerik */
              style={{
                marginTop: 6,
                marginBottom: 20,
                alignSelf: !this.props.context.localization.isRightToLeft ? 'left' : 'right',
                flexGrow: '1'
              }}
              direction='vertical'
              alignment='left'
              responsive={false}
              alignment='spaceBetween'
              context={this.props.context}>

              {this.state != null && this.state.historyList != null ? this.state.historyList : (<div></div>)}

            </BFlexPanel>
          </div>

          <div
            style={{
              display: this.getContentVisibility() == false ? 'block' : 'none',
              height: 40
            }}>
          </div>
        </BFlexPanel>
      </BFlexPanel>

    );
  }
}
export default BRouteHistoryExpandableItem;
