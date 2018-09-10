import { BComponent } from 'b-component';
import { PropTypes } from 'prop-types';
import { BButton } from 'b-button';
import React from 'react';


class CalendarActionButton extends BComponent {
  static propTypes = {
    autoOk: PropTypes.bool,
    cancelLabel: PropTypes.node,
    okLabel: PropTypes.node,
    onTouchTapCancel: PropTypes.func,
    onTouchTapOk: PropTypes.func,
  };
  constructor(props, context) {
    super(props, context);
  }
  renderCancelButton() {
    const {cancelLabel} = this.props;
    return (
      <BButton
          context={this.props.context}
          type="flat"
          text={cancelLabel}
          colorType="primary"
          onClick={this.props.onTouchTapCancel}
          />
    );
  }
  renderOkButton() {
    const { okLabel} = this.props;
    return (
      <div>
        {!this.props.autoOk &&
          <BButton
          context={this.props.context}
          type="flat"
          text={okLabel}
          colorType="primary"
          onClick={this.props.onTouchTapOk}
          disabled={this.refs.calendar !== undefined && this.refs.calendar.isSelectedDateDisabled()}
          />
        }
      </div>
    );
  }
  render() {

    const styles = {
      root: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        margin: 0,
        maxHeight: 48,
        padding: 0,
        paddingTop:6,
        paddingBottom:6
      },
      flatButtons: {
        fontsize: 14,
        margin: '4px 8px 8px 0px',
        maxHeight: 36,
        minWidth: 64,
        padding: 0,
      },
    };
    const isRtl = this.props.context.localization.isRightToLeft;

    return (
      <div style={styles.root}>
        {
        isRtl &&
        this.renderOkButton()
        }
        {
        isRtl &&
        this.renderCancelButton()
        }
        {
        !isRtl &&
        this.renderCancelButton()
        }
        {
        !isRtl &&
        this.renderOkButton()
        }

      </div>
    );
  }
}

export default CalendarActionButton;
