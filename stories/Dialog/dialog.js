import React from 'react';
import { DialogHelper } from '@boa/components/Dialog';
import { Button } from '@boa/components/Button';
import { ComponentBase, ComponentComposer } from '@boa/base';

@ComponentComposer
class DialogHelperFixture extends ComponentBase {
  constructor(props, context) {
    super(props, context);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    DialogHelper.show(this.props.context, <div>Hello world</div>);
  }

  render() {
    return (
      <Button
        context={this.props.context}
        variant="raised"
        text={'Single Line'}
        onClick={this.onClick} />
    );
  }
}

export default DialogHelperFixture;
