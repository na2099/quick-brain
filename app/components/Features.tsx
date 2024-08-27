import React from 'react';
import styled from 'styled-components';

const FeaturesContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px 0;
`;

const Feature = styled.div`
  margin: 0 15px;
  text-align: center;
`;

const Icon = styled.div`
  font-size: 2em;
  margin-bottom: 10px;
`;

const FeatureText = styled.p`
  font-size: 1.1em;
`;

const Features = () => {
  return (
    <FeaturesContainer>
      <Feature>
        <Icon>💡</Icon>
        <FeatureText>Step-by-step explanations</FeatureText>
      </Feature>
      <Feature>
        <Icon>✨</Icon>
        <FeatureText>Recommendations</FeatureText>
      </Feature>
      <Feature>
        <Icon>🧑‍🏫</Icon>
        <FeatureText>Help from expert tutors</FeatureText>
      </Feature>
    </FeaturesContainer>
  );
};

export default Features;
