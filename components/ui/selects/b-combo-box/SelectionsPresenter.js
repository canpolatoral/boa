import React from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';

import { BComponent } from 'b-component';
import { BInput } from 'b-input';
import { BToolTip } from 'b-tool-tip';
import { BIconButton } from 'b-icon-button';

class SelectionsPresenter extends BComponent {
  static propTypes = {
    ...BComponent.propTypes,
    selectedItems: PropTypes.arrayOf(PropTypes.any),
    value: PropTypes.arrayOf(PropTypes.any),
    labelText: PropTypes.string,
    hintText: PropTypes.string,
    errorText: PropTypes.string,
    disabled: PropTypes.bool,
    displayMemberPath: PropTypes.string,
    valueMemberPath: PropTypes.string,
    displayLabelMemberPath: PropTypes.arrayOf(PropTypes.string),
    displayLabelSeperator: PropTypes.string,
    multiSelect: PropTypes.bool,
    multiColumn: PropTypes.bool,
    dataSource: PropTypes.array,
    inlineGridMode:PropTypes.bool,
    onFocus:PropTypes.func,
  };

  static defaultProps={
    dataSource:[],
  }

  constructor(props, context) {
    super(props, context);
    this.state = { value: this.props.value, selectedItems: this.props.selectedItems };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value ||
      nextProps.selectedItems !== this.props.selectedItems) {
      this.setState({ value: nextProps.value, selectedItems: nextProps.selectedItems });
    }
  }

  updateSelectionRender(selectedItems, value) {
    this.setState({ value: value, selectedItems: selectedItems });
  }

  displaySelectionsRenderer(txt, vl) {
    const { displayMemberPath, valueMemberPath, displayLabelSeperator, displayLabelMemberPath, dataSource, multiColumn, multiSelect } = this.props;
    // To render DisplayLabel if displayLabelMemberPath and displayLabelSeperator are filled.
    if (Array.isArray(displayLabelMemberPath) && displayLabelMemberPath.length > 0 && typeof displayLabelSeperator === 'string' && vl && vl.length == 1) {
      var valueMember = vl[0];
      var displayLabel = '';
      for (var i = 0; i < dataSource.length; i++) {
        var data = dataSource[i][valueMemberPath];
        if (data == valueMember) {
          for (var j = 0; j < displayLabelMemberPath.length; j++) {
            var displayLabelMember = displayLabelMemberPath[j];
            var displayLabelText = dataSource[i][displayLabelMember];
            if (displayLabelText) {
              displayLabel = displayLabel.concat(' ', displayLabelText, displayLabelSeperator);
            }
          }
        }
      }
      // To remove last seperator letter of the displayLabel.
      return displayLabel.substring(1, displayLabel.length - displayLabelSeperator.length);
    }
    if (txt && txt.length == 1 && multiColumn == false && multiSelect == false) {
      return txt[0][displayMemberPath];
    }
    else if (txt && txt.length == dataSource.length && txt.length > 1 && dataSource.length > 1) {
      return this.getMessage('BusinessComponents', 'AllSelected');
    }
    else if (txt && dataSource.length > 0 && txt.length > 1 ) {
      return txt.length + ' ' + this.getMessage('BusinessComponents', 'ItemsSelected');
    }
    else if (txt && txt.length == 1) {
      return txt[0][displayMemberPath];
    }
    else {
      return null;
    }
  }

  getWidth() {
    var width = findDOMNode(this.bComboBoxDivMain).clientWidth;
    return width;
  }

  validateConstraint() {
    return this.bInput ? this.bInput.getInstance().validateConstraint() : true;
  }

  render() {
    const { context, labelText, hintText, errorText, disabled, displayMemberPath, valueConstraint } = this.props;

    var divStyle = { position: 'absolute', right: -10, top: 0};
    if (labelText && labelText != '') {
      divStyle.top = 25;
    }
    if (this.props.context.localization.isRightToLeft) {
      divStyle = { position: 'absolute', left: -10, top: 25 };
    }

    var inputValue = this.displaySelectionsRenderer(this.state.selectedItems, this.state.value);
    var toolTipText = [];
    if (this.state.selectedItems && this.state.selectedItems.length > 1) {
      for (let i = 0; i < this.state.selectedItems.length; i++) {
        if (i >= 9) {
          toolTipText.push(<div> ... </div>);
          break;
        } else {
          toolTipText.push(<div> {this.state.selectedItems[i][displayMemberPath]} </div>);
        }
      }
    }

    let suffix=(
      <BIconButton
        iconProperties= {{
          style: {
            color: this.props.context.theme.boaPalette.base400,
            width: 24,
            height: 24,
          }}}
        context={this.props.context}
        dynamicIcon='ArrowDropDown'
        style={{
          width:24,
          height:24,
          marginTop:7
        }}
        onClick= {this.props.onFocus}
        disabled={ this.state.disabled}
        />
    );

    return (
      <div ref={r => this.bComboBoxDivMain = r} style={{ position: 'relative' }} >
        <div>
          <BToolTip  context={context} tooltip={toolTipText} tooltipPosition='down'>
            <div
              ref={ref => (this.root = ref)}
              tabIndex='0'
              style={{
                cursor: 'pointer',
                outline: 'none',
                position: 'relative'
              }}>
              <BInput context={context}
                ref={r => this.bInput = r}
                disabled={disabled}
                valueConstraint={valueConstraint}
                value={inputValue}
                fullWidth={true}
                hintText={hintText}
                floatingLabelText={labelText}
                errorText={errorText}
                inlineGridMode={this.props.inlineGridMode}
                onFocus={this.props.onFocus}
                inputStyle={{
                  cursor:'pointer'
                }}
                suffixText={suffix}
              />
            </div>
          </BToolTip>
        </div>
      </div>
    );
  }
}

export default SelectionsPresenter;
