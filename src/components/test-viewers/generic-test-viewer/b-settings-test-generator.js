import React from 'react';
var BButton = require('b-button').BButton;
import { BSettings } from 'b-settings';

export class BSettingsTestGenerator {
  static plusSvgIcon = 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z';
  static yellow = '#ffff00';
  static darkBlue = '#0000A0';


  generate(context) {

    return [
      {
        'text': 'Ayarlar Test',
        'component': <div style={{ marginBottom: '10px' }}>

          <BButton context={context}
            type="raised"
            text="OPEN IN DIALOG"
            colorType="primary"
            onClick={() => BSettings.show(context)}
            style={{ margin: '10px' }}
          />

          {/* <BCard
            context={context}>
            <BSettings context={context} />
          </BCard> */}
        </div>
      }
    ];
  }
}
export default BSettingsTestGenerator;
