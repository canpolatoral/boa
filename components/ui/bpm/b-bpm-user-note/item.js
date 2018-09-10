import React from 'react';
import PropTypes from 'prop-types';

import { BComponent, BComponentComposer, Utils } from 'b-component';
import { BLocalization } from 'b-localization';
import { BFlexPanel } from 'b-flex-panel';

var User = require('b-icon').Others.User;

@BComponentComposer
export class BUserNoteItem extends BComponent {
  static propTypes = {
    ...BComponent.propTypes,
    noteItem: PropTypes.any,
    dividerVisibility: PropTypes.bool,
    form: PropTypes.any,
    settingContract: PropTypes.any,
    isExpanded: PropTypes.bool
  };

  static defaultProps = {
    ...BComponent.defaultProps

  };


  /**
   * Creates an instance of BUserNoteItem.
   * @param {any} props
   * @memberof BUserNoteItem
   */
  constructor(props, context) {
    super(props, context);
  }

  /**
   * getHeaderTextStye
   *
   * @returns
   * @memberof BUserNoteItem
   */
  getHeaderTextStye() {

    var textColor = this.props.context.theme.boaPalette.base400;
    var backgroundColor = this.props.context.theme.boaPalette.base150;

    var stye = {
      display: this.props.noteItem.isMainInstanceNote == 1 ? 'none' : '',
      color: textColor,
      fontWeight: '700',
      background: backgroundColor,
      height: 22,
      paddingLeft: 8,
      paddingRight: 8,
      paddingTop: 2,
      borderRadius: 4,
      fontSize: 13

    };
    return stye;
  }

  /**
   * getUserImage
   *
   * @returns
   * @memberof BUserNoteItem
   */
  getUserImage() {
    var imgDivStyle = {
      width: '56px',
      height: '56px',
      borderWidth: 1,
      borderRadius: 56,
      borderStyle: 'solid',
      borderColor: this.props.context.theme.boaPalette.base150,
      objectFit: 'cover',
      objectPosition: 'Top'
    };
    var imgStyle = {
      width: '56px',
      height: '56px'
    };

    var imageSource;
    // kullanıcı resmi var
    if (this.props.noteItem.userImage) {
      imageSource = 'data:image/jpeg;base64,' + this.props.noteItem.userImage;
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
            color={this.props.context.theme.boaPalette.base250} />
        </div>
      );
    }
  }

  /**
   * render
   *
   * @returns
   * @memberof BUserNoteItem
   */
  render() {

    var isMobile = Utils.isMobile(this.props);

    return (


      <BFlexPanel
        /** root */
        alignment={!this.props.context.localization.isRightToLeft ? 'left' : 'right'}
        direction='vertical'
        alignItems='stretch'
        responsive={false}
        style={{ marginLeft: isMobile ? 16 : 24, marginRight: isMobile ? 16 : 24 }}
        context={this.props.context}>

        <BFlexPanel
          /** kullanıcı resmi ve bilgiler */
          alignment={!this.props.context.localization.isRightToLeft ? 'left' : 'right'}
          isReverse={!this.props.context.localization.isRightToLeft ? false : true}
          direction='horizontal'
          alignItems='stretch'
          responsive={false}
          context={this.props.context}>

          {/* kullanıcı resmi */}
          {this.getUserImage()}

          {/* bilgiler */}
          <BFlexPanel
            style={{ width: '100%' }}
            direction='horizontal'
            isReverse={!this.props.context.localization.isRightToLeft ? false : true}
            alignItems='stretch'
            alignment='spaceBetween'
            responsive={false}
            context={this.props.context}>
            {/* bilgiler */}
            <div style={{
              marginLeft: !this.props.context.localization.isRightToLeft ? '12px' : '0px',
              marginRight: !this.props.context.localization.isRightToLeft ? '0px' : '12px'
            }}>
              <p style={{
                marginBottom: 0,
                marginTop: 0,
                minHeight: 22
              }}>
                <span style={{
                  color: this.props.context.theme.boaPalette.base450,
                  fontSize: 14,
                  fontWeight: 700
                }}
                >
                  {this.props.noteItem.userName != null ? this.props.noteItem.userName : this.props.noteItem.userCode}
                </span>

                <span style={{
                  color: this.props.context.theme.boaPalette.base300,
                  fontSize: 14,
                  marginLeft: !this.props.context.localization.isRightToLeft ? '0px' : '5px',
                  marginRight: !this.props.context.localization.isRightToLeft ? '5px' : '0px',
                }}>
                  ,
                </span>

                <span style={{
                  color: this.props.context.theme.boaPalette.base300,
                  fontSize: 14
                }}
                >
                  {this.props.noteItem.workgroupName}
                </span>
              </p>

              {/* not eklenme tarihi */}
              <p style={{
                marginBottom: 0,
                marginTop: 0,
                minHeight: 22
              }}>
                <span style={{
                  color: this.props.context.theme.boaPalette.base300,
                  fontSize: 14
                }}>
                  {BLocalization.formatDateTime(this.props.noteItem.insertDate, 'LLL')}
                </span>
              </p>
            </div>

            <div /** tip */
              style={this.getHeaderTextStye()} >
              {this.props.noteItem.flowName}
            </div>
          </BFlexPanel>

        </BFlexPanel>

        <p style={{
          color: this.props.context.theme.boaPalette.base450,
          fontSize: 14,
          marginTop: 16,
          minHeight: 22
        }}>{this.props.noteItem.description}</p>

      </BFlexPanel>


    );
  }
}

export default BUserNoteItem;
