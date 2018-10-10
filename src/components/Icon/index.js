import React from 'react';

import MuiIcon from '@material-ui/core/Icon';
import MuiSvgIcon from '@material-ui/core/SvgIcon';
import * as SvgIcons from '@material-ui/icons';
import * as BIcons from './icons';

export class Icon {
  static getIcon(cmpProps) {
    if (cmpProps.svgIcon) {
      let result = (<MuiSvgIcon {...cmpProps.iconProperties}><path d={cmpProps.svgIcon} /></MuiSvgIcon>);
      return result;
    }
    else if (cmpProps.fontIcon) {
      return (<MuiIcon {...cmpProps.iconProperties}> {cmpProps.fontIcon} </MuiIcon>);
    }
    else if (cmpProps.dynamicIcon) {
      let DynamicIcon = SvgIcons[cmpProps.dynamicIcon];
      if (DynamicIcon)
        return (<DynamicIcon {...cmpProps.iconProperties} />);
    }
    else if (cmpProps.bIcon && cmpProps.iconProperties) {
      const folder = BIcons[cmpProps.iconProperties.folder];
      let BIconType = folder && folder[cmpProps.bIcon] ? folder[cmpProps.bIcon] : BIcons.Actions.None;
      return (<BIconType {...cmpProps.iconProperties} />);
    }
    else if (cmpProps.icon) {
      let icon = React.cloneElement(cmpProps.icon, { ...cmpProps.iconProperties });
      return icon;
    }
    return null;
  }
}

export default Icon;

export * from './icons';
