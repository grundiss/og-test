import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Noto+Sans&display=swap');
 
  body {
    padding: 0;
    margin: 0;
    font-family: 'Noto Sans', sans-serif;
  }
`;

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-column-gap: 16px;
  width: 100%;
`;

export const FilterPanel = styled.div`
  background: #ffffbb;
  padding: 20px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid #e2e2e2;
`;

export const HeaderM = styled.h3`
  font-weight:bold;
  font-size:1.6em;
  margin-bottom: 2em;
`

export const HeaderS = styled.h4`
  font-weight: bold;
  font-size: 1em;
  text-transform: uppercase;
`;

export const Actor = styled.li`
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const LoadMore = styled.button`
  display: block;
  width: 100%;
  background: red;
  padding: 16px;
  color: #fff;

  &:disabled {
    background: #ccc;
  }
`;
