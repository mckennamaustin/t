import styled, { css } from 'styled-components';
import { space, width, fontSize, color } from 'styled-system';

const Span = styled.span`
  ${space};
  ${width};
  ${fontSize};
  ${color};
`;

const Note = styled(Span)`
  font-size: 12px;
  font-style: italic;
  font-weight: 300;
  color: #3b4056;
  padding: 0;
  margin: 0;
  display: block;
`;

export { Span, Note };
