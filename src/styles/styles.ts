import styled from 'styled-components';
import { darken } from 'polished';

export const AppContainer = styled.main`
  // mobile styles
  width: 36rem;
  height: 72rem;
  margin: 0 auto;

  // small tablet styles
  @media (min-width: 62rem) {
  }

  // large tablets styles & laptop styles
  @media (min-width: 96rem) {
  }

  // desktop styles
  @media (min-width: 120rem) {
  }
`;

interface ButtonProps {
  width?: string;
}

export const Button = styled.button<ButtonProps>`
  width: ${(props) => props.width || '100%'};

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${(props) => props.theme.primary};
  border-color: ${(props) => props.theme.primary};

  padding: 1.8rem 0.94rem;
  border-radius: 0.3rem;

  font-size: 2rem;
  font-weight: bold;
  line-height: 2.4rem;
  letter-spacing: 0.05rem;
  text-transform: uppercase;

  color: ${(props) => props.theme.white};
  box-shadow: 0 0.3rem 0 0 ${(props) => props.theme.primaryDark};
  cursor: pointer;

  :hover {
    background-color: ${(props) => props.theme.primaryDark};
  }
  /*
  :disabled {
    background-color: ${(props) => props.theme.primary};
    border-color: ${(props) => props.theme.primary};
    color: white;
  }

  :active:enabled {
    -moz-box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.3);
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.3);
    background-color: ${(props) => darken(0.1, 'blue')};
  } */
`;