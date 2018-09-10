import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete'; // { ActionAndroid, ImageCamera }
import * as SvgIcons from '@material-ui/icons';
import { copyToClipboard } from 'b-helpers';
var BButton = require('b-button').BButton;
import { BComponent } from 'b-component';

export class BButtonTestGenerator {
  static plusSvgIcon = 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z';
  static yellow = '#ffff00';
  static darkBlue = '#0000A0';

  constructor() {
    this.disabled = false;
  }

  _onclick() {
    copyToClipboard('Mustafa');
    BComponent.FormManager.showStatusMessage('button clicked!\nNusret Parlak');
  }

  _btnDisableOnclick() {
    this.disabled = !this.disabled;
    this.BtnAddNew.getInstance().setDisable(this.disabled);
  }

  generate(context) {
    let dynamicIconName = 'List';
    var DynamicIcon = SvgIcons[dynamicIconName];

    return [
      {
        text: 'Dynamic Icon',
        component: (
          <div>
            <div style={{ marginBottom: '10px' }}>
              <BButton
                context={context}
                ref={r => (this.BtnAddNew = r)}
                size={'small'}
                type="raised"
                text="Add New"
                icon={<DynamicIcon />}
                onClick={this._onclick.bind(this)}
                disabled={this.disabled}
                style={{ marginRight: '10px', width: '250px' }}
                textPosition={'left'}
              />
              <button id="disable" onClick={this._btnDisableOnclick.bind(this)} style={{ marginLeft: '10px' }}>
                Disable/Enable
              </button>
            </div>
          </div>
        )
      },
      {
        text: 'Size',
        component: (
          <div>
            <div style={{ marginBottom: '10px' }}>
              <BButton
                context={context}
                size={'small'}
                type="raised"
                text="Small"
                style={{ marginRight: '10px' }}
              />
              <BButton
                context={context}
                size={'medium'}
                type="raised"
                text="Medium"
                style={{ marginRight: '10px' }}
              />
              <BButton
                context={context}
                size={'large'}
                type="raised"
                text="Large"
                style={{ marginRight: '10px' }}
              />

              <BButton
                context={context}
                type="raised"
                text="Custom Size"
                style={{ marginRight: '10px', fontSize:'9px', padding:'3px 6px', minWidth: '70px', minHeight: '24px' }}
              />

              <BButton
                context={context}
                type="raised"
                text="Custom Size"
                style={{ marginRight: '10px', fontSize:'16px', padding:'20px 24px' }}
              />
            </div>
          </div>
        )
      },
      {
        text: 'Flat Button',
        component: (
          <div>
            <div style={{ marginBottom: '10px' }}>
              <BButton context={context} type="flat" text="Default" onClick={this._onclick.bind(this)} style={{ marginRight: '10px' }} />
              <BButton
                context={context}
                type="flat"
                text="Primary"
                colorType="primary"
                onClick={this._onclick.bind(this)}
                style={{ marginRight: '10px' }}
              />
              <BButton
                context={context}
                type="flat"
                text="Secondary"
                colorType="secondary"
                onClick={this._onclick.bind(this)}
                style={{ marginRight: '10px' }}
              />
              <BButton
                context={context}
                type="flat"
                text="Disabled"
                disabled={true}
                onClick={this._onclick.bind(this)}
                style={{ marginRight: '10px' }}
              />
            </div>
          </div>
        )
      },
      {
        text: 'Raised Button',
        component: (
          <div>
            <BButton
              context={context}
              type="raised"
              text="Add New"
              svgIcon={BButtonTestGenerator.plusSvgIcon}
              onClick={this._onclick.bind(this)}
              style={{ marginRight: '10px' }}
            />
            <BButton
              context={context}
              type="raised"
              text="Go to Home"
              fontIcon="home"
              iconProperties={{ style: { color: '#00BF7E' } }}
              colorType="secondary"
              onClick={this._onclick.bind(this)}
              style={{ marginRight: '10px', color: '#fff' }}
            />
            <BButton
              context={context}
              type="raised"
              text="Add New"
              svgIcon={BButtonTestGenerator.plusSvgIcon}
              colorType="primary"
              onClick={this._onclick.bind(this)}
              style={{ marginRight: '10px' }}
            />
            <BButton
              context={context}
              type="raised"
              text="Camera"
              icon={<DeleteIcon color={BButtonTestGenerator.darkBlue} />}
              onClick={this._onclick.bind(this)}
              style={{
                marginRight: '10px',
                backgroundColor: BButtonTestGenerator.yellow,
                color: BButtonTestGenerator.darkBlue,
                fontWeight: 'bold'
              }}
            />
          </div>
        )
      },
      {
        text: 'Floating Action Button',
        component: (
          <div>
            <BButton
              context={context}
              type="fab"
              onClick={this._onclick.bind(this)}
              fontIcon="home"
              style={{ marginRight: '10px' }}
              colorType="primary"
            />
            <BButton
              context={context}
              type="fab"
              onClick={this._onclick.bind(this)}
              svgIcon={BButtonTestGenerator.plusSvgIcon}
              style={{ marginRight: '10px' }}
            />
            <BButton
              context={context}
              type="fab"
              onClick={this._onclick.bind(this)}
              fontIcon="home"
              style={{ marginRight: '10px' }}
              disabled={true}
            />
            <BButton
              context={context}
              type="fab"
              onClick={this._onclick.bind(this)}
              icon={<DeleteIcon />}
              colorType="primary"
              style={{ marginRight: '10px' }}
            />
            <BButton
              context={context}
              type="fab"
              onClick={this._onclick.bind(this)}
              svgIcon={BButtonTestGenerator.plusSvgIcon}
              style={{ marginRight: '10px' }}
              colorType="secondary"
            />
            <BButton
              context={context}
              type="fab"
              onClick={this._onclick.bind(this)}
              fontIcon="home"
              style={{ marginRight: '10px' }}
              mini={true}
            />
            <BButton
              context={context}
              type="fab"
              onClick={this._onclick.bind(this)}
              svgIcon={BButtonTestGenerator.plusSvgIcon}
              style={{ marginRight: '10px' }}
              colorType="secondary"
              mini={true}
            />
            <BButton
              context={context}
              type="fab"
              onClick={this._onclick.bind(this)}
              svgIcon={BButtonTestGenerator.plusSvgIcon}
              style={{ marginRight: '10px' }}
              backgroundColor={BButtonTestGenerator.yellow}
              mini={true}
            />
          </div>
        )
      },
      {
        text: 'Icon Button',
        component: <BButton context={context} type="icon" tooltip="ToolTip" fontIcon="home" text="Click Me!" />
      }
    ];
  }
}
export default BButtonTestGenerator;
