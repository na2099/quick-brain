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

export default function LandingPage() {
  return (
    <AppContainer>
      <Header />
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-6xl font-bold mt-10">Welcome to QuickBrain</div>
      </div>
      <Features />
      <FileUpload />
      <SchoolsNearby />
      <Footer />
    </AppContainer>
  );
}