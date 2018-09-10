import React from 'react';
var BButton = require('b-button').BButton;
import BDynamicActionEdit from '../../dynamic/b-dynamic-action-edit';
import { BDialogHelper } from 'b-dialog-box';
import { BComponent } from 'b-component';

export class BDynamicActionEditTestGenerator {
  static plusSvgIcon = 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z';
  static yellow = '#ffff00';
  static darkBlue = '#0000A0';

  openResourceDialog(context) { 

    let dialogStyle;
    if (context.deviceSize < BComponent.Sizes.MEDIUM) {
      dialogStyle = { width: '90%', height: '90%' };
    } else {
      dialogStyle = { width: '60%', height: '85%' };
    }

    let dialog = (
      <BDynamicActionEdit
        context={context}
      />
    );

    BDialogHelper.showWithResourceCode(context, null, dialog, 0, 0, 'EditActionTitle', this.handleOnDialogClose.bind(this), dialogStyle);
  }

  handleOnDialogClose(dialogResponse, data) {
    if (dialogResponse == BComponent.DialogResponse.OK) {
       
    }
  }

  generate(context) {
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

            {/* <BCard
            context={context}>
            <BSettings context={context} />
          </BCard> */}
          </div>
        )
      }
    ];
  }
}
export default BDynamicActionEditTestGenerator;
