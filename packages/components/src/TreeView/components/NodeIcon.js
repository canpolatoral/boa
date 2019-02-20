/* eslint-disable template-tag-spacing */
import React from 'react';
import styled from 'styled-components';
import FolderSpecial from '@material-ui/icons/FolderSpecial';
import FolderOpen from '@material-ui/icons/FolderOpen';
import { Icon } from '@kuveytturk/boa-components/Icon';

const NodeIcon = styled(({ state, ...props }) =>
  props.icon ? (
    <span className={props.className}>
      {React.isValidElement(props.icon) ? props.icon : Icon.getIcon(props.icon)}
    </span>
  ) : (
    <span className={props.className}>
      {{
        opened: <FolderOpen style={{ color: props.context.theme.boaPalette.pri500 }} />,
        closed: <FolderSpecial style={{ color: props.context.theme.boaPalette.pri500 }} />,
      }[state] || <FolderSpecial style={{ color: props.context.theme.boaPalette.pri500 }} />}
    </span>
  ),
)`
  text-align: center;
  width: 24px;
  margin-${props => (props.context.localization.isRightToLeft ? 'left' : 'right')}: 12px;
  display: inline-block;
  vertical-align: middle;
  height: ${props => props.rowHeight}px;
  line-height: ${props => props.rowHeight}px;
  & svg {
    height: ${props => props.rowHeight}px;
    line-height: ${props => props.rowHeight}px;
  }
`;

export default NodeIcon;
