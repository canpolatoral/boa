import React from 'react';

export default function IconComposer(IconType) {
  return (props) => {
    // eslint-disable-next-line no-unused-vars
    const { context, newLine, ...otherProps } = props;
    return (
      <IconType {...otherProps} />
    );
  };
}
