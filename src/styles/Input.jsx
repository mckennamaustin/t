import styled, { css } from 'styled-components';
import { fontWeight, fontSize, color, space } from 'styled-system';

const Input = styled.input`
  ${fontWeight};
  ${fontSize};
  ${color};
  ${space};

  border: 0;
  outline: none;
  background-color: #f8f9fb;
  border: 1px solid #e1e2e4;
  border-radius: 24px;
  padding: 5px 15px;
  font-size: 16px;
`;

export { Input };
