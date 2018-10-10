import React from 'react';
export function IconComposer(IconType) {
  return (props) => {
    // eslint-disable-next-line no-unused-vars
    var { context, newLine, ...otherProps } = props;
    return (
      <IconType {...otherProps} />
    );
  };
}
export default IconComposer;
