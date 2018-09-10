import React from 'react';
import { BLinearPanel } from 'b-linear-panel';
import { BButton } from 'b-button';

export class BLinearPanelTestGenerator {

  _onclick() {
    alert('ses deneme');
  }

  generate(context) {
    return [
      {
        'text': 'BLinearPanel Horizontal',
        'component':
  <BLinearPanel
                    context={context}
                    orientation='horizontal'>
    <BButton context={context}
                        type="flat"
                        text="BLinearPanel Test 1"
                        colorType="primary"
                        onClick={this._onclick.bind(this) }
                        />
    <BButton context={context}
                        type="flat"
                        text="BLinearPanel Test 2"
                        colorType="primary"
                        onClick={this._onclick.bind(this) }
                        />
    <BButton context={context}
                        type="flat"
                        text="BLinearPanel Test 3"
                        colorType="primary"
                        onClick={this._onclick.bind(this) }
                        />
  </BLinearPanel>
      },
      {
        'text': 'BLinearPanel Vertical',
        'component':
  <BLinearPanel
                    context={context}
                    orientation='vertical'>
    <BButton context={context}
                        type="flat"
                        text="BLinearPanel Test 1"
                        colorType="primary"
                        onClick={this._onclick.bind(this) }
                        />
    <BButton context={context}
                        type="flat"
                        text="BLinearPanel Test 2"
                        colorType="primary"
                        onClick={this._onclick.bind(this) }
                        />
    <BButton context={context}
                        type="flat"
                        text="BLinearPanel Test 3"
                        colorType="primary"
                        onClick={this._onclick.bind(this) }
                        />
  </BLinearPanel>
      }
    ];
  }
}
export default BLinearPanelTestGenerator;