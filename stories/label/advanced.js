import React from 'react';

import { text } from '@storybook/addon-knobs';

import { getTheme } from '../../src/base/b-theme';
import { BLabel } from '../../src/components/label/b-label';

var context = {};
context.theme = getTheme({ themeName: 'violet' });
context.localization = [];
context.localization.isRightToLeft = false;

export default () => {
  let margin = '10px';
  let thinGrayBorder = 'solid 1px #eeeeee';
  let dynamicBorder = (rowIndex) => { console.log(rowIndex); return rowIndex > 0 ? thinGrayBorder : null; };

  return (
    <table style={{ width: '100%' }}>
      <tbody>
        <tr key={1} style={{ borderTop: dynamicBorder(1) }}>
          <td style={{ verticalAlign: 'top', borderRight: thinGrayBorder, paddingRight: margin, paddingTop: margin, paddingBottom: margin }}>
            <label style={{ marginTop: margin }}>1. maxWidth=250:</label>
          </td>
          <td style={{ paddingTop: margin, paddingBottom: margin, paddingLeft: margin }}>
            <BLabel context={context}
              maxWidth={250}
              text={text('Text', 'Lorem ing elit. Donec malesuada, sem quis lacinia elementum, urna mi elementum metus')}>
            </BLabel>
          </td>
        </tr>
        <tr key={2} style={{ borderTop: dynamicBorder(2) }}>
          <td style={{ verticalAlign: 'top', borderRight: thinGrayBorder, paddingRight: margin, paddingTop: margin, paddingBottom: margin }}>
            <label style={{ marginTop: margin }}>2. maxWidth=250, minFontSize=8:</label>
          </td>
          <td style={{ paddingTop: margin, paddingBottom: margin, paddingLeft: margin }}>
            <BLabel context={context}
              maxWidth={250}
              minFontSize={8}
              text={text('Text2', 'Lorem ing elit. Donec malesuada, sem quis lacinia elementum, urna mi elementum metus')}>
            </BLabel>
          </td>
        </tr>
        <tr key={3} style={{ borderTop: dynamicBorder(3) }}>
          <td style={{ verticalAlign: 'top', borderRight: thinGrayBorder, paddingRight: margin, paddingTop: margin, paddingBottom: margin }}>
            <label style={{ marginTop: margin }}>3. maxWidth=500:</label>
          </td>
          <td style={{ paddingTop: margin, paddingBottom: margin, paddingLeft: margin }}>
            <BLabel context={context}
              maxWidth={500}
              text={text('Text3', 'Lorem ing elit. Donec malesuada, sem quis lacinia elementum, urna mi elementum metus')}>
            </BLabel>
          </td>
        </tr>
        <tr key={4} style={{ borderTop: dynamicBorder(4) }}>
          <td style={{ verticalAlign: 'top', borderRight: thinGrayBorder, paddingRight: margin, paddingTop: margin, paddingBottom: margin }}>
            <label style={{ marginTop: margin }}>4. maxWidth=750, minFontSize=13:</label>
          </td>
          <td style={{ paddingTop: margin, paddingBottom: margin, paddingLeft: margin }}>
            <BLabel context={context}
              maxWidth={500}
              minFontSize={13}
              text={text('Text4', 'Lorem ing elit. Donec malesuada, sem quis lacinia elementum, urna mi elementum metus')}>
            </BLabel>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
