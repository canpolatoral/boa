import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton/IconButton';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import { BComponent } from 'b-component';


class CalendarToolbar extends BComponent {

  constructor(props, context) {
    super(props, context);
  }

  static propTypes = {
    DateTimeFormat: PropTypes.func.isRequired,
    displayDate: PropTypes.object.isRequired,
    nextMonth: PropTypes.bool,
    onMonthChange: PropTypes.func,
    prevMonth: PropTypes.bool,
    handleClickToolBar: PropTypes.func,
    format: PropTypes.string,
    localization: PropTypes.func,
  };

  static defaultProps = {
    nextMonth: true,
    prevMonth: true,
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

  handleTouchTapPrevMonth = () => {
    if (this.props.onMonthChange) {
      this.props.onMonthChange(-1);
    }
  };

  handleTouchTapNextMonth = () => {
    if (this.props.onMonthChange) {
      this.props.onMonthChange(1);
    }
  };
  handleClickToolBar() {
    if (this.props.handleClickToolBar) {
      this.props.handleClickToolBar();
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
        marginTop:8,
        cursor:'pointer'
      },
      titleText: {
        height: 'inherit',
        textAlign: 'center',
        cursor: 'pointer',
        color:this.props.context.theme.boaPalette.base450
      },
      iconButton: {
        width: 40,
        height: 40,
        padding:0,
        marginTop:-2,
        marginLeft:this.props.context.localization.isRightToLeft?0:2,
        marginRight:this.props.context.localization.isRightToLeft?2:0
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
        <IconButton
          disabled={!this.props.prevMonth}
          onClick={this.handleTouchTapPrevMonth}
          style={styles.iconButton}
          >
          <ChevronLeft />
        </IconButton>

        <div style={styles.titleDiv}  key={dateTimeFormatted} onClick={this.handleClickToolBar.bind(this)}>
          {dateTimeFormatted}
        </div>
        <IconButton
          disabled={!this.props.nextMonth}
          onClick={this.handleTouchTapNextMonth}
          style={styles.iconButton}
          >
          <ChevronRight />
        </IconButton>
      </div>
    );
  }
}

export default CalendarToolbar;
