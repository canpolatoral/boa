import React from 'react';

const BButton = require('b-button').BButton;


export class BDivitComponentGenerator {
  initialize(self) {
    this.self = self;
  }

  handleClose(dialogResponse, data) {
    if (data) {
      alert('Total document count : ' + data.documentArray.length);
    }
  }

  handleOpenDivit() {
    // BDivitHelper.showDivitDialog(this.self.props.context, '030f116a-a086-4085-bdc8-937b7420015d', '123456789', 'Write', this.handleClose.bind(this));
  }

  handleOpenPersonDivit() {
    // BDivitHelper.showPersonDivitDialog(this.self.props.context, 42208907, 51858, 'Write', this.handleClose.bind(this));
  }

  generate(context) {
    return (
    [
      {
        'text': 'Divit Sample',
        'component':
  <BButton context={context}
                     type="raised"
                     text="Open Divit"
                     onClick={this.handleOpenDivit.bind(this)}
                     colorType="primary"
                     style={{marginRight: '10px'}}/>

      },
      {
        'text': 'Person Divit Sample',
        'component':
  <BButton context={context}
                     type="raised"
                     text="Open Person Divit"
                     onClick={this.handleOpenPersonDivit.bind(this)}
                     colorType="primary"
                     style={{marginRight: '10px'}}/>

      }
    ]
    );
  }
}

export default BDivitComponentGenerator;

