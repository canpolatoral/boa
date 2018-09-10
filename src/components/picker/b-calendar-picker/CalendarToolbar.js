import React from 'react';
import PropTypes from 'prop-types';
import { BComponent } from 'b-component';


class CalendarToolbar extends BComponent {

  constructor(props, context) {
    super(props, context);
  }

  static propTypes = {
    DateTimeFormat: PropTypes.func.isRequired,
    displayDate: PropTypes.object.isRequired,
    format: PropTypes.string,
    localization: PropTypes.func,
  };

  static defaultProps = {
  };

  state = {
    transitionDirection: 'up',
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.displayDate !== this.props.displayDate) {
      const direction = nextProps.displayDate > this.props.displayDate ? 'left' : 'right';
      this.setState({
        transitionDirection: direction,
      });
    }
  }

  render() {

    let styles = {
      root: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: 'inherit',
        height: 38,
      },
      titleDiv: {
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
        height: 38,
        width: '100%',
        marginTop:8
      },
      titleText: {
        height: 'inherit',
        textAlign: 'center',
        cursor: 'pointer',
        color:this.props.context.theme.boaPalette.base450
      }
    };

    const {DateTimeFormat, displayDate} = this.props;

    const dateTimeFormatted = new DateTimeFormat({
      item: 'monthYearName',
      localization: this.props.localization,
      format: this.props.format,
    }).format(displayDate);

    return (
      <div style={styles.root}>
        <div style={styles.titleDiv}  key={dateTimeFormatted}>
          {dateTimeFormatted}
        </div>
      </div>
    );
  }
}

export default CalendarToolbar;
