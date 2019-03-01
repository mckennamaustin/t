import styled, { css } from 'styled-components';

export const Button = styled.button`
  padding: 18px 18px;
  outline: none;
  border: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &:focus {
    outline: none;
  }

  &::-moz-focus-inner {
    border: 0;
  }

  cursor: pointer;
`;
