import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.div`
  background-color: #212529;
  color: white;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FooterGrid = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
`;

const FooterSection = styled.div`
  margin: 0 15px; /* Adds space between sections */
`;

const FooterTitle = styled.h4`
  margin-bottom: 10px;
`;

const FooterLink = styled.a`
  display: block;
  color: #bbb;
  margin-bottom: 5px;
  text-decoration: none;

  &:hover {
    color: white;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterGrid>
        <FooterSection>
          <FooterTitle>Company</FooterTitle>
          <FooterLink href="#">About Us</FooterLink>
        </FooterSection>
        <FooterSection>
          <FooterTitle>Get Quick Brain</FooterTitle>
          <FooterLink href="#">iOS</FooterLink>
          <FooterLink href="#">Android</FooterLink>
        </FooterSection>
      </FooterGrid>
    </FooterContainer>
  );
};

export default Footer;
