import styled from 'styled-components';

const Footer = styled.p`
  margin: 0;
  padding: 14px 18px;
  background-color: white;
  border-width: 0px;
  border-top: 0;
  border-style: solid;
  font-size: 14px;
  border-color: ${props => props.context.theme.boaPalette.base200};
`;

export default Footer;
