import React from 'react'; import PropTypes from 'prop-types';
import { Card, CardActions } from '@material-ui/core';

import { BComponent } from 'b-component';
import { BThemeProvider } from 'b-component';
import { BButton } from 'b-button';

export class BAppCard extends BComponent {
  static propTypes = {
    /**
     * disable or not for child elements.
     */
    disabled: PropTypes.bool,
    /**
     * Padding of card content.
     */
    padding: PropTypes.number,
    /**
     * Can be used to render elements inside the Card.
     */
    children: PropTypes.node,
    /**
     * Override the inline-styles of the container element.
     */
    containerStyle: PropTypes.object,
    /**
     * Override the inline-styles of the root element.
     */
    style: PropTypes.object,
    title: PropTypes.string,
    titleOnClick: PropTypes.func,
    cardOnClick: PropTypes.func,
    deleteOnClick: PropTypes.func,
    svgIcon: PropTypes.string,
    iconTitleText: PropTypes.string,
    isNewAppCard: PropTypes.bool,
    actionList: PropTypes.array,
    detailText: PropTypes.string,
    appLogoPath: PropTypes.string,
    tagText: PropTypes.string,
    tagColor: PropTypes.string,
    actionOnClick: PropTypes.func
  }

  static defaultProps = {
    disabled: false,
    padding: 24,
    title: '',
    onExpandChange: null,
    svgIcon: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
    iconTitleText: null,
    isNewAppCard: true,
    appLogoPath: null
  }

  static yellow = '#ffff00';

  constructor(props, context) {
    super(props, context);
  }

  setDisable(value) {
    this.setState({ disabled: value });
  }

  actionOnClick(index) {
    this.props.actionOnClick && this.props.actionOnClick(index);
  }

  titleOnClick(e) {
    this.props.titleOnClick && this.props.titleOnClick(e);
  }

  cardOnClick(e) {
    this.props.cardOnClick && this.props.cardOnClick(e);
  }

  deleteOnClick(e) {
    this.props.deleteOnClick && this.props.deleteOnClick(e);
  }

  triggerInput = () => {
    // TODO: Burası sonra yapılacak
  };

  render() {
    const buttonTextBlock = {
      width: '100%',
      height: 210,
      textAlign: 'center',
      cursor: 'pointer'
    };

    const textBlock = { fontSize: 24, padding: '10px 0px 0px 0px' };
    const buttonBlock = { padding: '60px 10px 10px 10px' };

    // Application seçili card
    const firstLineBlock = {
      height: 84,
      position: 'relative',
      display: 'flex'
    };

    const logoBlock = { padding: 12, flexGrow: 0 };
    const logoIconBlock = { width: 60, height: 60 };

    const tagDivStyle = {
      height: 22,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: (this.props.tagColor || 'black'),
      borderRadius: 2,
      position: 'absolute',
      right: -4,
      top: -4
    };
    const tagTextStyle = {
      display: 'inline-block',
      textAlign: 'center',
      color: (this.props.tagColor || 'black'),
      fontSize: 12,
      fontWeight: 'bold',
      padding: 4
    };
    const titleBlockStyle = {
      height: 84,
      padding: 12,
      paddingLeft: 0,
      flexGrow: 1,
      display: 'flex',
      wordBreak: 'break-word'
    };
    const titleStyle = {
      marginTop: 'auto',
      marginBottom: 'auto',
      maxHeight: '100%',
      overflow: 'auto',
      fontWeight: 400,
      color: this.props.context.theme.boaPalette.pri500,
      cursor: this.props.titleOnClick ? 'pointer' : undefined
    };

    const secondLineBlock = {
      padding: '0px 12px',
      textAlign: 'left',
      height: 70,
      overflow: 'auto',
      wordBreak: 'break-word'
    };

    // const actionButtonStyle = { display: 'inline-block' };
    const actionButtonStyle = { minWidth: 50 };

    const buttonTextStyle = { paddingLeft: 4, paddingRight: 4, color: this.props.context.theme.boaPalette.pri500 };

    /* Card default behaviour. */
    if (this.props.isNewAppCard) {
      return (
        <BThemeProvider theme={this.props.context.theme}>
          <Card
            containerStyle={this.props.containerStyle}
            style={this.props.style}>
            <div style={buttonTextBlock} onClick={this.cardOnClick.bind(this)}>
              <div style={buttonBlock}>
                <BButton context={this.props.context}
                  type="floatingAction"
                  onClick={this.actionOnClick.bind(this, -1)}
                  svgIcon={this.props.svgIcon}
                  style={null}
                  mini={true} />
              </div>
              <div style={textBlock}>{this.props.iconTitleText}</div>
            </div>
          </Card>
        </BThemeProvider>
      );
    }
    else {
      return (
        <BThemeProvider theme={this.props.context.theme}>
          <Card
            containerStyle={this.props.containerStyle}
            style={this.props.style}>
            <div style={firstLineBlock}>
              <div style={logoBlock}>
                <img src={this.props.appLogoPath} style={logoIconBlock}></img>
              </div>
              <div style={titleBlockStyle}>
                <label style={titleStyle} onClick={this.titleOnClick.bind(this)}>{this.props.title}</label>
              </div>
              {this.props.tagText ?
                (
                  <div style={tagDivStyle}>
                    <label style={tagTextStyle}>{this.props.tagText}</label>
                  </div>) :
                  <div> <BButton context={this.props.context}
                      type="icon"
                      tooltip="Delete"
                      svgIcon="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                      text="Delete!"
                      onClick = {this.deleteOnClick.bind(this)}
                  /></div>}
            </div>
            <div style={secondLineBlock}>{this.props.detailText}</div>
            <CardActions style={{ padding: 0, paddingLeft: 12, paddingRight: 12 }}>
              {
                this.props.actionList && this.props.actionList.map((item, index) => {
                  return (
                    <BButton context={this.props.context}
                      type="flat"
                      text={item}
                      textPosition="after"
                      textStyle={buttonTextStyle}
                      style={actionButtonStyle}
                      onClick={this.actionOnClick.bind(this, index)} />);
                })
              }
            </CardActions>
          </Card>
        </BThemeProvider>
      );
    }
  }
}

export default BAppCard;
