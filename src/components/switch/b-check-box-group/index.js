import React from 'react'; import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import { BComponent, BComponentComposer } from 'b-component';
import { BLabel } from 'b-label';
import { BCheckBox } from 'b-check-box';

@BComponentComposer
export class BCheckBoxGroup extends BComponent {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    defaultSelected: PropTypes.any,
    name: PropTypes.string.isRequired,
    checkedItems: PropTypes.array,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    style: PropTypes.object,
    items: PropTypes.array.isRequired,
    errorText: PropTypes.string,
  }

  static defaultProps = {
    ...BComponent.defaultProps
  };

  state = {
    disabled: this.props.disabled,
    checkedItems: []
  };

  constructor(props, context) {
    super(props, context);
    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.disabled !== this.props.disabled) {
      this.setState({ disabled: nextProps.disabled });
    }
  }

  setDisable(value) {
    this.setState({ disabled: value });
  }

  checkChanged(e, isChecked, checkBoxValue) {
    let item = this.props.items.find((item) => {
      return item.value == checkBoxValue;
    });
    if (item) {
      item.checked = isChecked;

      if (this.props.onChange) {
        this.props.onChange(this.getValue());
      }
    }
  }

  getValue() {
    return this.props.items && this.props.items.filter((item) => {
      return item.checked == true;
    }).map((item) => {
      return item.value;
    });
  }

  render() {
    let errorStyle = {
      color: this.props.context.theme.boaPalette.error500,
      fontSize: 11,
      marginTop: 2,
      height: 16,
      textAlign: this.props.context.localization.isRightToLeft ? 'right' : 'left',
    };
    const headerStyle = {
      leftToRight: {
        marginLeft: 0,
        marginRight: 0,
        fontSize: 11,
        height: 13,
        color: this.props.context.theme.boaPalette.pri500
      },
      rightToLeft: {
        marginLeft: 0,
        marginRight: 0
      }
    };

    let headStyle = this.props.context.localization.isRightToLeft ?
      merge({}, headerStyle.leftToRight, headerStyle.rightToLeft) :
      headerStyle.leftToRight;

    let groupItems = this.props.items.map((item, index) => {

      let isDisabled = false;
      if (this.state.disabled || item.disabled) {
        isDisabled = true;
      }
      return (
        <BCheckBox
          context={this.props.context}
          errorTextVisible={false}
          key={'checkbox_' + { index }}
          value={item.value}
          checked={item.checked}
          onCheck={this.checkChanged.bind(this)}
          label={item.label}
          disabled={isDisabled}
        />
      );
    });
    return (
      <div id='checkboxGroupDiv' style={{ display: 'flex', flexDirection: 'column' }} >
        <div style={{ height: 12, width: '100%' }} ></div>
        <BLabel context={this.props.context} text={this.props.headerText} style={headStyle} />
        <div style={{ height: 6, width: '100%' }} ></div>
        {groupItems}
        {
          this.props.errorText ? (
            <BLabel
              style={errorStyle}
              context={this.props.context}
              text={this.props.errorText}
            />
          ) : null
        }
      </div>
    );
  }

  onChange(event, newSelection) {
    if (this.props.onChange) {
      this.props.onChange(event, newSelection);
    }
  }
}

export default BCheckBoxGroup;
