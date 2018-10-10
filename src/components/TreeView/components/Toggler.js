import React from 'react';
import styled from 'styled-components';
import Add from '@material-ui/icons/Add';
import Remove from '@material-ui/icons/Remove';


const Toggler = styled(({ state, ...props }) => (
  <a {...props}>
    {state === 'closed' && <Add style={{ color: props.context.theme.boaPalette.base400 }} />}
    {state === 'opened' && <Remove style={{ color: props.context.theme.boaPalette.base400 }} />}
  </a>
))`
  text-align: center;
  width: 24px; 
  margin-${props => (props.context.localization.isRightToLeft ? 'left' : 'right')}: 12px;
  display: inline-block;
  vertical-align: middle; 
  height: ${props => props.rowHeight}px;
  line-height: ${props => props.rowHeight}px;
  cursor: pointer;
  & svg {
    vertical-align: middle;
  }
`;

export default Toggler;
