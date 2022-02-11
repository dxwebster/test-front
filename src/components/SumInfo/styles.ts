import styled from 'styled-components';

export const Container = styled.div`
  height: 15rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;

  border: 1px solid #ccc;
  border-radius: 0.3rem;

  @media (min-width: 48rem) {
    grid-area: sumInfo;
  }

  li {
    font-size: 1.4rem;
    line-height: 1.7rem;
    color: ${(props) => props.theme.types.text};
    text-transform: uppercase;

    display: flex;
    justify-content: space-between;

    &.discount {
      color: ${(props) => props.theme.colors.primary};
    }

    &.total {
      font-weight: bold;
    }
  }
`;
