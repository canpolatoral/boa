import React from 'react';
import PropTypes from 'prop-types';

import { BComponent } from 'b-component';
import { BButton } from 'b-button';

class SelectionsPresenterPopup extends BComponent {
  static propTypes = {
    ...BComponent.propTypes,
    dataSource: PropTypes.array,
    displayMemberPath: PropTypes.string,
    onClickClearSelected: PropTypes.func,
    getCurrentSelectedItemsOfParent: PropTypes.func
  };

  constructor(props, context) {
    super(props, context);
    this.state = { dataSource: this.props.dataSource };
    this.onclickClearSelected = this.onclickClearSelected.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataSource !== this.props.dataSource) {
      this.setState({ dataSource: nextProps.dataSource });
    }
  }

  onclickClearSelected() {
    this.props.onClickClearSelected && this.props.onClickClearSelected();
  }

  render() {
    const lineHeight = 40;
    const { context, displayMemberPath, getCurrentSelectedItemsOfParent } = this.props;
    const clearTextBtnColor = this.props.context.theme.boaPalette.pri500;
    const summaryTextColor = this.props.context.theme.boaPalette.base400;

    var clearSelectedButtonStyle = { position: 'absolute', bottom: 0, right: 12, fontSize: '13px', fontWeight: 'bold', color: clearTextBtnColor };
    var selectionTextStyle = { bottom: 0, position: 'absolute', lineHeight: lineHeight + 'px', left: 12, height: 40, color: summaryTextColor, fontSize: '14px' };
    if (this.props.context.localization.isRightToLeft) {
      clearSelectedButtonStyle = { position: 'absolute', bottom: 0, left: 12, fontSize: '13px', fontWeight: 'bold', color: clearTextBtnColor };
      selectionTextStyle = { bottom: 0, position: 'absolute', lineHeight: lineHeight + 'px', right: 12, height: 40, color: summaryTextColor, fontSize: '14px' };
    }

    let selectionText = null;
    let selectedItems = getCurrentSelectedItemsOfParent ? getCurrentSelectedItemsOfParent() : [];
    let selectedItemLength = selectedItems ? selectedItems.length : 0;
    if (selectedItemLength == 0) {
      selectionText = this.getMessage('BusinessComponents', 'NoChoiseMade');
    }
    else if (selectedItemLength > 1 && this.state.dataSource.length > 1 && selectedItemLength == this.state.dataSource.length) {
      selectionText = this.getMessage('BusinessComponents', 'AllSelected');
    }
    else if (selectedItemLength == 1) {
      selectionText = selectedItems[0][displayMemberPath];
    }
    else if (selectedItemLength > 1) {
      selectionText = selectedItemLength + ' ' + this.getMessage('BusinessComponents', 'ItemsSelected');
    }

    var divContStyle = { height: lineHeight, marginTop: 18 };
    if (this.props.context.localization.isRightToLeft) {
      return (
        <div style={divContStyle}>
          {/* {!isMobileOrTablet ?
            <div style={selectionTextStyle}>
              {selectionText}
            </div>
            :<div></div> */}
          <div style={selectionTextStyle}>
            {selectionText}
          </div>
          {
            selectedItemLength > 0 ?
              <BButton
                context={context}
                type="flat"
                text={this.getMessage('BusinessComponents', 'Clean')}
                onClick={this.onclickClearSelected}
                style={clearSelectedButtonStyle} />
              :
              <div></div>
          }

        </div>
      );
    }
    else {
      return (
        <div style={divContStyle}>
          {
            selectedItemLength > 0 ?
              <BButton
                context={context}
                type="flat"
                text={this.getMessage('BusinessComponents', 'Clean')}
                onClick={this.onclickClearSelected}
                style={clearSelectedButtonStyle} />
              :
              <div></div>
          }
          {/* {!isMobileOrTablet ?
            <div style={selectionTextStyle}>
              {selectionText}
            </div>
            : <div></div>
          } */}
          <div style={selectionTextStyle}>
            {selectionText}
          </div>
          
        </div>
      );
    }
  }
}

export default SelectionsPresenterPopup;
