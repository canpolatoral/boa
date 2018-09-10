import React from 'react';

import { BComponent } from 'b-component';
import { BButton } from 'b-button';
import { BDialog } from 'b-dialog-box';
import { BCheckBox } from 'b-check-box';

export class BDialogCatalog extends BComponent {
  state = {
    open: false,
    modal: false
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  onModalCheck = (event, isInputChecked) => {
    this.setState({
      modal: isInputChecked
    });
  };

  render() {
    const actions = [
      <BButton context={this.props.context}
        type="flat"
        text="Cancel"
        onClick={this.handleClose}
        />,
      <BButton context={this.props.context}
        type="flat"
        text="Submit"
        onClick={this.handleClose}
        />,
    ];

    return (
      <div>
        <BCheckBox context={this.props.context}
          defaultChecked={false}
          label="Modal Dialog? (A modal dialog can only be closed by selecting one of the actions.)"
          onCheck={this.onModalCheck} />
        <BButton context={this.props.context}
          type="raised"
          text="Show dialog"
          textPosition="after"
          onClick={this.handleOpen}
          style={{ marginRight: '10px' }}
          />
        <BDialog context={this.props.context}
          title="Dialog With Actions"
          actions={actions}
          modal={this.state.modal}
          open={this.state.open}
          onRequestClose={this.handleClose}>
            The actions in this window were passed in as an array of React objects.
        </BDialog>
      </div>
    );
  }
}

export default BDialogCatalog;
