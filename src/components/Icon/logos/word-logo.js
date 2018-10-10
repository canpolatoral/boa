import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

let WordLogo = (props) => {
  // eslint-disable-next-line no-unused-vars
  var { context, ...otherProps } = props;
  return (
    <SvgIcon {...otherProps} >
      <path d="M6,2A2,2,0,0,0,4,4V20a2,2,0,0,0,2,2H18a2,2,0,0,0,2-2V8L14,2Z" style={{fill:'#295391'}}  />
      <path d="M14.48,18.35,16.06,13h1.4l-2.38,7H13.94l-2-5.3L10,20H8.88L6.51,13H7.9l1.61,5.24L11.41,13h1.13Z" style={{fill:'#fff'}}  />
      <polygon points="13 9 13 3.5 18.5 9 13 9" style={{fill:'#fff'}} />

    </SvgIcon>
  );
};

WordLogo.defaultProps = {
  viewBox: '0 0 24 24'
};

export default WordLogo;
