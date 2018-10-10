import React from 'react';
import styled from 'styled-components';
import BCheckbox from 'b-check-box';
import RadioButtonChecked from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUnchecked from '@material-ui/icons/RadioButtonUnchecked';

const Radiobox = styled(({ node, ...props }) => (
  <BCheckbox
    className={props.className}
    checkedIcon={<RadioButtonChecked />}
    icon={<RadioButtonUnchecked />}
    context={props.context}
    checked={node.state.checked}
    indeterminate={false}
    disabled={node.isCheckable === undefined ? false : !node.isCheckable}
    onChange={props.onChange}
    style={
      node.state.indeterminate
        ? {
          color: props.context.theme.boaPalette.base400,
          width: '24px',
          marginRight: !props.context.localization.isRightToLeft && '12px',
          marginLeft: props.context.localization.isRightToLeft && '12px',
          marginTop: '0px',
          height: props.rowHeight
        }
        : {
          width: '24px',
          marginRight: !props.context.localization.isRightToLeft && '12px',
          marginLeft: props.context.localization.isRightToLeft && '12px',
          marginTop: '0px',
          height: props.rowHeight
        }
    }
  />
))`
  width: 24px;
`;

// const Checkbox = styled(({ node, ...props }) => (
//     <BCheckbox
//       className={props.className}
//      checkedIcon={<RadioButtonChecked />}
//      icon={<RadioButtonUnchecked />}
//      context={props.context}
//      checked={node.state.checked}
//      indeterminate={false}
//      onChange={props.onChange}
//     />
//   ))`
//     width: 24px;
//     margin-top: 0;
//     height: ${props => props.rowHeight}px;
//     line-height: ${props => props.rowHeight}px;
//     margin-${props => (props.context.localization.isRightToLeft ? 'left' : 'right')}: 12px;
//     color: ${props => (props.node.state.indeterminate ? props.context.theme.boaPalette.base400 : 'inherit')};
//   `;

export default Radiobox;
