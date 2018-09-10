import React from 'react';
var BButton = require('b-button').BButton;
var BReportPost = require('b-report-post').BReportPost;
import { BDialogHelper } from 'b-dialog-box';
import { BComponent } from 'b-component';
import BCheckBox from 'b-check-box';

export class BReportPostTestGenerator {
  static plusSvgIcon = 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z';
  static yellow = '#ffff00';
  static darkBlue = '#0000A0';

  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
    self.state = {
      isPostman: true,
    };
  }

  openResourceDialog(context) {
    let dialogStyle;
    if (context.deviceSize < BComponent.Sizes.MEDIUM) {
      dialogStyle = { width: '90%', height: '90%' };
    } else {
      dialogStyle = { width: '63%', height: '85%' };
    }

    let dialog = <BReportPost context={context} isPostman={this.self.state.isPostman} />;

    BDialogHelper.showWithResourceCode(context, null, dialog, 0, 0, 'BReportPost', this.handleOnDialogClose.bind(this), dialogStyle);
  }

  handleOnDialogClose(dialogResponse, data) {
    if (dialogResponse == BComponent.DialogResponse.OK) {
    }
  }

  generate(context, self) {
    return [
      {
        text: 'Ayarlar Test',
        component: (
          <div style={{ marginBottom: '10px' }}>
            <BButton
              context={context}
              type="raised"
              text="OPEN IN DIALOG"
              colorType="primary"
              onClick={() => {
                this.openResourceDialog(context);
              }}
              style={{ margin: '10px' }}
            />

            <BCheckBox
              context={context}
              checked={self.state.isPostman}
              label={'isPostman'}
              onChange={(e, v) => {
                this.self.setState({
                  isPostman: v
                });
              }}
            />
          </div>
        )
      }
    ];
  }
}
export default BReportPostTestGenerator;
