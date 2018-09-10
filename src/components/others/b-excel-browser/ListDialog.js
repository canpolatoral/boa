import React from 'react'; import PropTypes from 'prop-types';

import { BComponent, BComponentComposer } from 'b-component';
import { BTransactionForm } from 'b-transaction-form';
import { BCard } from 'b-card';
import { BInput } from 'b-input';
import { BDialogHelper } from 'b-dialog-box';
@BComponentComposer
export class ListDialog extends BComponent {

  static propTypes = {
    /**
    * Base properties from BBusinessComponent.
    */
    ...BComponent.props,
    /**
    * Indicates the resource info.
    */
    resourceInfo: PropTypes.any,
    /**
    * Indicates the resource code.
    */
    resourceCode: PropTypes.string,
    /**
    * the event to handle closing.
    */
    handleClose: PropTypes.func
  };

  static defaultProps = {
    /**
    * Default prop values from BComponent
    */
    ...BComponent.defaultProps,
    resourceCode: 'YONTEXCELD'
  };

  constructor(props, context) {
    super(props, context);

    let val = this.props.value;
    if (val instanceof Array) {
      if (val.length > 0 && val[0] instanceof Array) {
        val = val[0].map(function (item) {
          return item;
        });
      }
      val = val.join('\n');
    }

    this.state = {
      value: val || ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleClose = () => {
    BDialogHelper.close(this, BComponent.DialogResponse.NONE, this.state.value);
  }

  actionBarButtonClick(e) {
    if (e.commandName == 'Ok') {
      BDialogHelper.close(this, BComponent.DialogResponse.OK, this.state.value);
    }
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    return (
      <BTransactionForm
        {...this.props}
        resourceInfo={this.props.resourceInfo}
        onClosing={this.handleClose}
        onActionClick={this.actionBarButtonClick.bind(this)}>
        <BCard context={this.props.context} expandable={false} initiallyExpanded={false}>
          <BInput
            context={this.props.context}
            multiLine={true}
            floatingLabelText={this.props.floatingLabelText}
            hintText={this.props.hintText}
            rows={3}
            onChange={this.handleChange}
            value={this.state.value}
          />
        </BCard>
      </BTransactionForm>
    );
  }
}

export default ListDialog;
