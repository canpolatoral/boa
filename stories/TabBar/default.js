import React from 'react';
import styled from 'styled-components';

const PreviewContainer = styled.div`
  font-family: Consolas;
  font-size: 14px;
  font-weight: bold;
  color: #9197a3;
  backgroundColor: #fff;
  padding: 20px;
  min-height: 10px;
`;

export default {
  tabItems: [
    {
      text: 'Test',
      value: 0,
      content: <PreviewContainer>Tab Content 1</PreviewContainer>,
    },
    {
      text: 'Test 2',
      value: 1,
      content: <PreviewContainer>Tab Content 2</PreviewContainer>,
    },
    {
      text: 'Test 3',
      value: 2,
      content: <PreviewContainer>Tab Content 3</PreviewContainer>,
    },
  ],
};
