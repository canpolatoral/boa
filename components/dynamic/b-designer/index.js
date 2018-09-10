import React from 'react';
import BDesignerBoardTransaction from './transaction';
import BDesignerBoardBrowse from './browse';

import {  BComponentComposer } from 'b-component';
import { BBusinessComponent } from 'b-business-component';

@BComponentComposer
export class BDesigner extends BBusinessComponent {

  constructor(props, context) {
    super(props, context);

    this.onClosing = this.onClosing.bind(this);
  }

  onClosing() {
    if (this.props.onClosing) {
      this.props.onClosing();
    }
  }

  render() {
    if (this.props.designerType === 'transaction')
      return <BDesignerBoardTransaction {...this.props} ref={ref => this.board = ref} />;
    else
      return <BDesignerBoardBrowse {...this.props} ref={ref => this.board = ref} />;
  }

  getModel() {
    return this.board.child.getModel();
  }

  getValues() {
    return this.board.child.getValues();
  }
}
export default BDesigner;
