import React from 'react';
import MuiIcon from '@material-ui/core/Icon';
import MuiSvgIcon from '@material-ui/core/SvgIcon';
import * as SvgIcons from '@material-ui/icons';
import * as BIcons from './icons';

export class Icon {
  static getIcon(cmpProps) {
    if (cmpProps.svgIcon) {
      const result = (
        <MuiSvgIcon {...cmpProps.iconProperties}>
          <path d={cmpProps.svgIcon} />
        </MuiSvgIcon>
      );
      return result;
    }
    if (cmpProps.fontIcon) {
      return <MuiIcon {...cmpProps.iconProperties}> {cmpProps.fontIcon} </MuiIcon>;
    }
    if (cmpProps.dynamicIcon) {
      const DynamicIcon = SvgIcons[cmpProps.dynamicIcon];
      if (DynamicIcon) {
        return <DynamicIcon {...cmpProps.iconProperties} />;
      }
    }
    if (cmpProps.bIcon && cmpProps.iconProperties) {
      const folder = BIcons[cmpProps.iconProperties.folder];
      const BIconType =
        folder && folder[cmpProps.bIcon] ? folder[cmpProps.bIcon] : BIcons.Actions.None;
      return <BIconType {...cmpProps.iconProperties} />;
    }
    if (cmpProps.icon) {
      const icon = React.cloneElement(cmpProps.icon, { ...cmpProps.iconProperties });
      return icon;
    }
    return null;
  }
}

export default Icon;

export * from './icons';
