import React from 'react';
import PropTypes from 'prop-types';
import {BComponent, BComponentComposer} from 'b-component';
import {BBusinessComponent} from 'b-business-component';
import {BBaseForm} from 'b-base-form';
import {BDialogHelper} from 'b-dialog-box';
import {BCard} from 'b-card';
import {BDateTimePicker} from 'b-datetime-picker';
import {BScroll} from 'b-scroll';

@BComponentComposer
export default class AddValidityDateComponent extends BBusinessComponent {
  static propTypes = {
    /**
     * Base properties from BBusinessComponent.
     */
    ...BBusinessComponent.propTypes,
    /**
     * Indicates the validity begin date.
     */
    validityBeginDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    /**
     * Indicates the validity end date.
     */
    validityEndDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ])
  };

  static defaultProps = {
    /**
     * Base default properties from BBusinessComponent.
     */
    ...BBusinessComponent.defaultProps,
    resourceCode: 'YONTDMSVDD'
  };

  state = {
    validityBeginDate: this.props.validityBeginDate,
    validityEndDate: this.props.validityEndDate
  };

  actionBarButtonClick(e) {
    switch (e.actionId) {
      case 26: {
        if (!this.state.validityBeginDate || !this.state.validityEndDate) {
          return;
        }

        BDialogHelper.close(this, BComponent.DialogResponse.OK, {
          validityBeginDate: this.state.validityBeginDate,
          validityEndDate: this.state.validityEndDate
        });
        break;
      }
      case 6: {
        BDialogHelper.close(this, BComponent.DialogResponse.CANCEL, null);
        break;
      }
    }
  }

  onCloseClick() {
    BDialogHelper.close(this, BComponent.DialogResponse.CANCEL, null);
  }

  render() {
    const {context} = this.props;

    return (
      <BBaseForm context={context}
                 {...this.props}
                 resourceInfo={this.props.resourceInfo}
                 onActionClick={this.actionBarButtonClick.bind(this)}
                 onClosing={this.onCloseClick.bind(this)}>
        <BScroll context={context} option={{suppressScrollX: true}}>
          <div style={{ padding: context.deviceSize < BComponent.Sizes.MEDIUM ? '24px 0 24px 0' : '24px' }}>
            <BCard context={context}>
              <BDateTimePicker
                context={context}
                floatingLabelTextDate={this.getMessage('DocumentManagement', 'ValidityBeginDate')}
                value={this.state.validityBeginDate}
                format={'DDMMYYYY'}
                pageType='transactional'
                dateOnChange={(event, value) => {
                  this.setState({validityBeginDate: value});
                }}
                minDate={this.props.context.applicationContext.channel.today}
                size={2}
              />
              <BDateTimePicker
                context={context}
                floatingLabelTextDate={this.getMessage('DocumentManagement', 'ValidityDate')}
                value={this.state.validityEndDate}
                format={'DDMMYYYY'}
                pageType='transactional'
                dateOnChange={(event, value) => {
                  this.setState({validityEndDate: value});
                }}
                size={2}
              />
            </BCard>
          </div>
        </BScroll>
      </BBaseForm>
    );
  }
}
