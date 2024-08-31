'use client';
import Navbar from '@/components/Navbar';
import React, { createContext } from 'react';
import styled from 'styled-components';
import Header from './components/Header';
import Features from './components/Features';
import FileUpload from './components/FileUpload';
import SchoolsNearby from './components/SchoolsNearby';
import Footer from './components/Footer';

// Define the styled container
const AppContainer = styled.div`
  background-color: #0d1117;
  color: white;
  font-family: 'Arial', sans-serif;
  min-height: 100vh;
`;

// Define the styled heading and catchphrase
const Heading = styled.div`
  text-align: center;
  margin-top: 10px;
`;

const Title = styled.div`
  font-size: 6rem;
  font-weight: bold;
`;

const Catchphrase = styled.div`
  font-size: 1.5rem;
  margin-top: 10px;
  font-style: italic;
`;

export default function LandingPage() {
  return (
    <AppContainer>
      <Header />
      <div className="flex flex-col items-center justify-center h-screen">
        <Heading>
          <Title>Welcome to QuickBrain</Title>
          <Catchphrase>Slay Your Study Game</Catchphrase>
        </Heading>
      </div>
      <Features />
      <FileUpload />
      <SchoolsNearby />
      <Footer />
    </AppContainer>
  );
}
