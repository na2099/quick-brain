import React from 'react';
import styled from 'styled-components';

const SchoolsContainer = styled.div`
  padding: 40px 20px;
  background-color: #f8f9fa;
  color: black;
`;

const SchoolsTitle = styled.h2`
  text-align: center;
  margin-bottom: 40px;
`;

const SchoolList = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
`;

const SchoolCard = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 45%;
  margin-bottom: 20px;
`;

const SchoolName = styled.h3`
  margin-bottom: 10px;
`;

const SchoolsNearby = () => {
  return (
    <SchoolsContainer>
      <SchoolsTitle>Explore top schools nearby*</SchoolsTitle>
      <SchoolList>
        <SchoolCard>
          <SchoolName>University of Ottawa</SchoolName>
          <p>314K Documents</p>
        </SchoolCard>
        <SchoolCard>
          <SchoolName>Carleton University</SchoolName>
          <p>155K Documents</p>
        </SchoolCard>
        {/* Add more schools as needed */}
      </SchoolList>
    </SchoolsContainer>
  );
};

export default SchoolsNearby;
