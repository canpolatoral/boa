import styled from 'styled-components';

const Text = styled.span`
  cursor: pointer;
  margin: 0;
  user-select: none;
  display: inline-block;
  vertical-align: middle;
  white-space: nowrap;
  height: ${props => props.rowHeight}px;
  line-height: ${props => props.rowHeight}px;
  font-size:14px;
  color: ${props => props.context.theme.boaPalette.base450};
  padding-${props => (props.context.localization.isRightToLeft ? 'left' : 'right')}: 6px;
  white-space: nowrap;

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

export default Text;
