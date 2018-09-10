import React from 'react';
import Icon from '@material-ui/core/Icon';
import SvgIcon from '@material-ui/core/SvgIcon';
import * as SvgIcons from '@material-ui/icons';
import * as BIcons from './icons'; 

export class BIcon {
  static getIcon(cmpProps) {
    if (cmpProps.svgIcon) {
      let result = (<SvgIcon {...cmpProps.iconProperties}><path d={cmpProps.svgIcon} /></SvgIcon>);
      return result;
    }
    else if (cmpProps.fontIcon) {
      return (<Icon {...cmpProps.iconProperties}> {cmpProps.fontIcon} </Icon>);
    }
    else if (cmpProps.dynamicIcon) {
      let DynamicIcon = SvgIcons[cmpProps.dynamicIcon];
      return (<DynamicIcon {...cmpProps.iconProperties} />);
    }
    else if (cmpProps.bIcon && cmpProps.iconProperties) {
      const folder = BIcons[cmpProps.iconProperties.folder];
      let BIconType = folder && folder[cmpProps.bIcon] ? folder[cmpProps.bIcon] : BIcons.Actions.None;
      return (<BIconType {...cmpProps.iconProperties} />);
    }
    else if (cmpProps.icon) {
      let icon = React.cloneElement(cmpProps.icon, {...cmpProps.iconProperties});
      return icon;
    }
    return null;
  }
}

export default BIcon;

export * from './icons';
