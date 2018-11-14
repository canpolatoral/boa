/* eslint-disable max-len */
import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

const PowerPointLogo = props => {
  // eslint-disable-next-line no-unused-vars
  const { context, ...otherProps } = props;
  return (
    <SvgIcon {...otherProps}>
      <path
        d="M6,2A2,2,0,0,0,4,4V20a2,2,0,0,0,2,2H18a2,2,0,0,0,2-2V8L14,2Z"
        style={{ fill: '#c44423' }}
      />
      <path
        d="M10.5,16.76V20H9V12.5h3.08a3.49,3.49,0,0,1,2.15.59A1.85,1.85,0,0,1,15,14.64a1.82,1.82,0,0,1-.76,1.57,3.67,3.67,0,0,1-2.17.55Zm0-1.13h1.57a2.3,2.3,0,0,0,1.19-.25.81.81,0,0,0,.41-.73.83.83,0,0,0-.41-.73,2.1,2.1,0,0,0-1.14-.28H10.5Z"
        style={{ fill: '#fff' }}
      />
      <polygon points="13 9 13 3.5 18.5 9 13 9" style={{ fill: '#fff' }} />
    </SvgIcon>
  );
};

PowerPointLogo.defaultProps = {
  viewBox: '0 0 24 24',
};

export default PowerPointLogo;
