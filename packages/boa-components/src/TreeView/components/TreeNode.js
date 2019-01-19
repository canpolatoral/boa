import styled from 'styled-components';

/* eslint-disable max-len */
const TreeNode = styled.div`
  cursor: default;
  position: relative;
  background: ${props => (props.selected ? 'RGBA(0, 0, 0, 0.14)' : 'transparent')};
  padding-${props => (props.context.localization.isRightToLeft ? 'right' : 'left')}: ${props =>
  props.depth * 36 + 24}px;
  color: ${props => props.context.theme.boaPalette.base450};
  clear: both;
  *zoom: 1;
  white-space: nowrap;
  display: flex;

  &:hover {
    background: RGBA(0, 0, 0, 0.08);
  }

  &:after {
    content: "";
    display: table;
    clear: both;
  }

  &:before {
    content: "";
    display: table;
  }
`;

export default TreeNode;
