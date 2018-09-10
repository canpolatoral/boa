import React from 'react';
var BAppCard = require('b-app-card').BAppCard;

export class BCardTestGenerator {
  constructor() {
    this.disabled = false;
  }

  _btnDisableOnclick(e) {
    this.disabled = !this.disabled;
    this.BCardComponent.setDisable(this.disabled);
  }

  _onclick() {
    alert('ses deneme');
  }

  generate(context) {

    return [
      {
        'text': 'Card',
        'component': <div style={{ display: 'flex' }}>
          <div style={{ display: 'inline-block' }}>
            <BAppCard context={context}
              expandable={false}
              iconTitleText={'New Application'}
              buttonTitles={['copy key', 'edit', 'delete']}
              title={'Exchange Comparison'}
              detailText={'Bankalar ve Merkez Bankası kurlarının anlık takibinin yapılabildiği uygulama'}
              isNewAppCard={false}
              appLogoPath={'https://www.smashingmagazine.com/wp-content/uploads/2017/04/ny-cat-round.svg'}
              liveImgPath={'https://static1.squarespace.com/static/51db2538e4b0be04447cbae3/t/53380ce1e4b08c9cb76ce9d8/1396182242172/live_transp400x400.png'}
              isLive={true}
            >
            </BAppCard>
          </div>
          <div style={{ display: 'flex', marginLeft: 20 }}>
            <BAppCard context={context}
              expandable={false}
              iconTitleText={'New Application'}
              isNewAppCard={true}
            >
            </BAppCard>
          </div>
        </div>
      }
    ];
  }
}
export default BCardTestGenerator;

