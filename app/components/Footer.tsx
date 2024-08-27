import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.div`
  background-color: #212529;
  color: white;
  padding: 40px 20px;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
`;

const FooterSection = styled.div``;

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
          <FooterLink href="#">Careers</FooterLink>
          {/* Add more links as needed */}
        </FooterSection>
        <FooterSection>
          <FooterTitle>Get Course Hero</FooterTitle>
          <FooterLink href="#">iOS</FooterLink>
          <FooterLink href="#">Android</FooterLink>
        </FooterSection>
        {/* Add more sections as needed */}
      </FooterGrid>
    </FooterContainer>
  );
};

export default Footer;
