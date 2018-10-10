import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import IconComposer from '../IconComposer';

let None = (props) => {
  return (
    <SvgIcon {...props} >
    </SvgIcon>
  );
};

None.defaultProps = {
  viewBox: '0 0 24 24'
};

export default IconComposer(None);
