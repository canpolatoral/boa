import React from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@material-ui/core/ButtonBase';
import { BComponent } from 'b-component';

function getStyles(props, context, state) {
  const { selected, time } = props;

  const { hover } = state;
  // this.props.context.theme.boaPalette.pri500
  return {
    root: {
      boxSizing: 'border-box',
      color: time === new Date().getFullYear() && props.context.theme.palette.primary1Color,
      display: 'block',
      fontSize: 14,
      margin: '0 auto',
      position: 'relative',
      textAlign: 'center',
      lineHeight: 'inherit',
      width: '100%',
      height: '48px',
      WebkitTapHighlightColor: 'rgba(0,0,0,0)', // Remove mobile color flashing (deprecated)
      background: hover && selected ? props.context.theme.boaPalette.pri300 : hover ? props.context.theme.boaPalette.base150 : selected ?  props.context.theme.boaPalette.pri250 : 'none',

    },
    label: {
      alignSelf: 'center',
      color: selected ? props.context.theme.boaPalette.pri500 : props.context.theme.boaPalette.base450,
      background: selected ? props.context.theme.boaPalette.pri250 : 'none',
      fontSize: selected ? 14 : 14,
      /* fontWeight: hover ? 450 : selected ? 500 : 400,*/
      fontWeight: hover ? 400 : selected ? 400 : 400,
      position: 'relative',
      top: -1,

    },
  };
}

class TimeButton extends BComponent {
  constructor(props, context) {
    super(props, context);
  }
  static propTypes = {
    children: PropTypes.node.isRequired,
    /**
     * The css class name of the root element.
     */
    className: PropTypes.string,
    onTouchTap: PropTypes.func,
    selected: PropTypes.bool,
    time: PropTypes.number.isRequired,
  };

  static defaultProps = {
    selected: false,
  };

  static contextTypes = {
    muiTheme: PropTypes.object,
  };

  state = {
    hover: false,
  };

  handleMouseEnter = () => {
    this.setState({ hover: true });
  };

  handleMouseLeave = () => {
    this.setState({ hover: false });
  };

  handleTouchTap = (event) => {
    if (this.props.onTouchTap) {
      this.props.onTouchTap(event, this.props.time);
    }
  };

  render() {
    const {
      children,
      className, // eslint-disable-line no-unused-vars
      onTouchTap, // eslint-disable-line no-unused-vars
      selected, // eslint-disable-line no-unused-vars
      time, // eslint-disable-line no-unused-vars
    } = this.props;


    const styles = getStyles(this.props, this.context, this.state);

    return (
      <ButtonBase
        // {...other}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleTouchTap}
        style={styles.root}
      >
        <span style={styles.label}>
          {children}
        </span>
      </ButtonBase>
    );
  }
}

export default TimeButton;
