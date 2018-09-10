import React from 'react';
import PropTypes from 'prop-types';
import { BComponent, BComponentComposer } from 'b-component';
import { BSpan } from 'b-span';

@BComponentComposer
export class BInformationText extends BComponent {
  static propTypes = {
    ...BComponent.propTypes,
    labelText: PropTypes.string,
    labelWidth: PropTypes.number,
    infoText: PropTypes.string,
    isComplex: PropTypes.bool,
    complexHeader: PropTypes.string,
    complexInfotext: [],
    complexInfotextStyle: [],
    highlightedText: PropTypes.string,
  };

  static defaultProps = {
    ...BComponent.defaultProps,
    labelWidth: '100%',
    isComplex: false
  };

  constructor(props, context) {
    super(props, context);

    this.rootDesktopStyle = {
      marginTop: '6px',
      marginBottom: '6px',
      height: 'auto',
    };
    this.rootMobileStyle = {
      marginTop: '6px',
      marginBottom: '6px',
    };
  }

  render() {
    let infoText = '-';
    if (this.props.infoText) {
      infoText = this.props.infoText;
    }
    let rootStyle = {};
    if (this.props.context.deviceSize >= BComponent.Sizes.MEDIUM) {
      rootStyle = this.rootDesktopStyle;
    } else {
      rootStyle = this.rootMobileStyle;
    }

    var descLabelStyle = { fontSize: '12px', display: 'inline', color: this.props.context.theme.boaPalette.base400 };
    var infoLabelStyle = { fontSize: '14px', display: 'inline', color: this.props.context.theme.boaPalette.base450 };
    var isRightToLeft = this.props.context.localization.isRightToLeft;
    var divStyle = { overflow: 'hidden', height: '0px', width: '0px' };
    var rowText = null;

    // ########Complex information label############
    if (this.props.isComplex) {
      var headerText = null;
      var complexInfotext = null;

      if (this.props.labelWidth) {
        headerText = (
          <BSpan context={this.props.context} style={{ fontSize: '11px', display: 'inline', color: this.props.context.theme.boaPalette.pri500 }} text={isRightToLeft ? (this.props.complexHeader)
            : (this.props.complexHeader)} maxWidth={this.props.labelWidth} />

        );
      } else {
        headerText = <BSpan context={this.props.context} style={{ fontSize: '11px', display: 'inline', color: this.props.context.theme.boaPalette.pri500 }} text={isRightToLeft ? (this.props.complexHeader)
          : (this.props.complexHeader)} />;

      }

      var i = 0;
      complexInfotext = this.props.complexInfotext.map((item) => {
        if (i == 0) {
          var style = this.props.complexInfotextStyle ?
            Object.assign({ fontSize: '14px', display: 'inline', color: this.props.context.theme.boaPalette.base450 }, this.props.complexInfotextStyle[0]) : { fontSize: '14px', display: 'inline', color: this.props.context.theme.boaPalette.base450 };
          i++;
          var tmptext = null;

          if (this.props.highlightedText) {
            var stylehighlighted = { fontSize: '14px', display: 'inline', color: this.props.context.theme.boaPalette.more500 };
            tmptext = (
              <div>
                <div> <BSpan context={this.props.context} style={style} text={this.props.complexInfotext[0]} /></div>
                <div> <BSpan context={this.props.context} style={stylehighlighted} text={this.props.highlightedText} /></div>
              </div>
            );
          }
          else {
            tmptext = (<div>
              <BSpan context={this.props.context} style={style} text={this.props.complexInfotext[0]} />
            </div>);

          }

          return (tmptext

          );
        }
        else {
          i++;
          return (
            <div>
              <BSpan context={this.props.context} style={style} text={isRightToLeft ? (item)
                : (item)} maxWidth={this.props.labelWidth} />
            </div>
          );
        }
      });

      rowText = (
        <div style={{ display: 'flow-root', 'flex-direction': isRightToLeft ? 'row-reverse' : null }}>
          <div>
            {headerText}
          </div>
          <div>
            {complexInfotext}
          </div>
        </div>
      );
    }
    else {

      // ########Basicr information label############

      if (this.props.labelWidth) {
        var labelText = (
          <BSpan context={this.props.context} style={descLabelStyle} text={!isRightToLeft ? ((this.props.labelText + ':') + '\u00A0') : ('\u00A0' + (':' + this.props.labelText))} maxWidth={this.props.labelWidth} />
          // <BLabel context={this.props.context} style={descLabelStyle} text={this.props.labelText + ': '} maxWidth={this.props.labelWidth} />
        );
      } else {
        labelText = (<BSpan context={this.props.context} style={descLabelStyle} text={(this.props.labelText + ':') + '\u00A0'} />

        );
        // <BLabel context={this.props.context} style={descLabelStyle} text={this.props.labelText + ': '} />;
      }
      var informationText = <BSpan context={this.props.context} style={infoLabelStyle} text={infoText} />;
      rowText =
        (
          <div>
            <div style={{ overflow: 'hidden', wordWrap: 'break-word', 'flex-direction': isRightToLeft ? 'row-reverse' : null, display: 'flex' }}>
              <div style={{ overflow: 'overlay'}}> {labelText}  </div>
              <div style={{ overflow: 'overlay'}}> {informationText}</div>
            </div>
          </div>
        );
    }

    return (
      <div style={{ 'text-align': isRightToLeft ? 'right' : 'left' }}>
        <p style={rootStyle}>
          {rowText}
          {/* <BLabel context={this.props.context} style={infoLabelStyle} text={infoText} /> */}
        </p>
        <div style={divStyle}>.</div>
      </div>
    );
  }
}

export default BInformationText;
