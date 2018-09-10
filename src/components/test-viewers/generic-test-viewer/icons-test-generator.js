import React from 'react';
import * as SvgIcons from '@material-ui/icons';
var BButton = require('b-button').BButton;

export class IconsTestGenerator {
  static plusSvgIcon = 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z';
  static yellow = '#ffff00';
  static darkBlue = '#0000A0';
  static textStyle = { textTransform: 'none' };

  _onclick(e) {
    alert('button clicked!');
  }

  generate(context) {
    let iconTypes = ['Action', 'Alert', 'Av', 'Communication', 'Content', 'Device', 'Editor', 'File',
      'Hardware', 'Image', 'Maps', 'Navigation', 'Notification', 'Places', 'Social', 'Toggle'];
    let iconGroups = iconTypes.map((iconType) => {
      return {
        'name': iconType,
        'icons': []
      };
    });

    for (var iconName in SvgIcons) {
      if (iconName) {
        let icon = SvgIcons[iconName];
        if (icon) {
          for (let iconGroupIndex in iconGroups) {
            let iconGroup = iconGroups[iconGroupIndex];
            if (iconName.indexOf(iconGroup.name) == 0) {
              iconGroup.icons.push({ 'name': iconName, 'icon': icon });
              break;
            }
          }
        }
      }
    }
    return iconGroups.map((iconGroup) => {
      let components = iconGroup.icons.map((icon) => {
        let DynamicIcon = icon.icon;
        return (
          <BButton context={context}
              key={icon.name}
              type="raised"
              text={icon.name}
              icon={<DynamicIcon />}
              style={{ marginRight: '5px', marginBottom: '5px' }}
              textStyle={IconsTestGenerator.textStyle}
              />
        );
      });
      return {
        'text': iconGroup.name,
        'component': <div>{components}</div>
      };
    });
  }
}
export default IconsTestGenerator;
