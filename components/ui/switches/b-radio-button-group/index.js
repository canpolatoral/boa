import React from 'react';
import PropTypes from 'prop-types';
import { RadioGroup } from '@material-ui/core';
import BRadioButton from 'b-radio-button';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';
import { BComponent, BComponentComposer } from 'b-component';

const styles = theme => ({
  root: {
    display: 'flex'
  },
  formLabelRoot: {
    paddingTop: 12,
    fontSize: 11,
    height: 30,
    lineHeight: '18px',
    marginBottom: 0,
    border: 'none',
    color: theme.boaPalette.pri500
  },
  formHelperTextRoot: {
    color: theme.boaPalette.error500,
    fontSize: 11,
    marginTop: 2,
    height: 16
  },
  horizontalGroup: {
    display: 'block'
  }
});

@BComponentComposer
@withStyles(styles)
export class BRadioButtonGroup extends BComponent {
  static propTypes = {
    ...BComponent.propTypes,
    children: PropTypes.node,
    headerText: PropTypes.string,
    className: PropTypes.string,
    labelPosition: PropTypes.oneOf(['left', 'right']),
    defaultSelected: PropTypes.any,
    name: PropTypes.string,
    valueSelected: PropTypes.any,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    style: PropTypes.object,
    items: PropTypes.array.isRequired,
    disableRipple: PropTypes.bool,
    errorText: PropTypes.string,
    direction: PropTypes.oneOf(['vertical', 'horizontal'])
  };

  static defaultProps = {
    ...BComponent.defaultProps,
    labelPosition: 'right',
    direction: 'vertical'
  };

  state = {
    disabled: this.props.disabled,
    valueSelected: this.props.defaultSelected || this.props.valueSelected || 'undefined'
  };

  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.disabled !== this.props.disabled || nextProps.valueSelected !== this.state.valueSelected) {
      this.setState({
        disabled: nextProps.disabled,
        valueSelected: nextProps.valueSelected
      });
    }
  }

  setDisable(value) {
    this.setState({ disabled: value });
  }

  getSnapshot() {
    return { state: this.state };
  }

  setSnapshot(snapshot) {
    let { state } = snapshot;
    this.setState({ ...state });
  }

  getValue() {
    return this.state.valueSelected;
  }

  handleChange = event => {
    if (this.props.onChange) {
      this.props.onChange(event, event.target.value);
    } else {
      this.setState({ valueSelected: event.target.value });
    }
  };

  render() {
    const { classes } = this.props;
    let directionClass = this.props.direction === 'horizontal' ? classes.horizontalGroup : undefined;

    let items = this.props.items || [];
    let groupItems = items.map((item, index) => {
      return (
        <BRadioButton
          key={'radio-' + index}
          context={this.props.context}
          errorTextVisible={false}
          labelPosition={this.props.labelPosition}
          label={item.label}
          value={String(item.value)}
          disabled={this.state.disabled || item.disabled}
          uncheckedIcon={item.checkedIcon}
          checkedIcon={item.checkedIcon}
          disableRipple={this.props.disableRipple}
        />
      );
    });

    return (
      <div className={classes.root}>
        <FormControl>
          {this.props.headerText && (
            <FormLabel className={classes.formLabelRoot} focused={false} required={false} component="legend">
              {this.props.headerText}
            </FormLabel>
          )}
          <RadioGroup value={this.state.valueSelected} name={this.props.name} onChange={this.handleChange} className={directionClass}>
            {groupItems}
          </RadioGroup>
          {this.props.errorText && <FormHelperText className={classes.formHelperTextRoot}>{this.props.errorText}</FormHelperText>}
        </FormControl>
      </div>
    );
  }
}

export default BRadioButtonGroup;
