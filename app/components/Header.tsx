import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  text-align: center;
  padding: 50px 20px;
`;

const Title = styled.h1`
  font-size: 3em;
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  font-size: 1.5em;
  margin-bottom: 40px;
`;

const Button = styled.button`
  background-color: #0a58ca;
  color: white;
  padding: 15px 30px;
  border: none;
  border-radius: 5px;
  font-size: 1.2em;
  cursor: pointer;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Title>Study seamlessly</Title>
      <Subtitle>Find all the relevant resources you need, right within your own document</Subtitle>
      <Button>Learn More</Button>
    </HeaderContainer>
  );
};

export default Header;
