import React from 'react';
import styled from 'styled-components';

import BCheckbox from '@boa/components/CheckBox';

const Checkbox = styled(({ node, ...props }) => (
  <BCheckbox
    className={props.className}
    context={props.context}
    checked={node.state.checked}
    indeterminate={node.state.indeterminate}
    onChange={props.onChange}
    disabled={node.isCheckable === undefined ? false : !node.isCheckable}
    style={
      node.state.indeterminate
        ? {
          display: 'flex',
          color: props.context.theme.boaPalette.base400,
          width: '24px',
          marginRight: !props.context.localization.isRightToLeft && '12px',
          marginLeft: props.context.localization.isRightToLeft && '12px',
          marginTop: '0px',
          height: props.rowHeight,
          lineHeight: props.rowHeight + 'px'
        }
        : {
          display: 'flex',
          width: '24px',
          marginRight: !props.context.localization.isRightToLeft && '12px',
          marginLeft: props.context.localization.isRightToLeft && '12px',
          marginTop: '0px',
          height: props.rowHeight,
          lineHeight: props.rowHeight + 'px'
        }
    }
  />
))`
  width: 24px;
`;


// const Checkbox = styled(({ node, ...props }) => (
//     <BCheckbox
//       className={props.className}
//       context={props.context}
//       checked={node.state.checked}
//       indeterminate={node.state.indeterminate}
//       onChange={props.onChange}
//     />
//   ))`
//     width: 24px;
//     margin-top: 0;
//     height: ${props => props.rowHeight}px;
//     line-height: ${props => props.rowHeight}px;
//     margin-${props => (props.context.localization.isRightToLeft ? 'left' : 'right')}: 12px;
//     color: ${props => (props.node.state.indeterminate ? props.context.theme.boaPalette.base400 : 'inherit')};
//   `;


export default Checkbox;
