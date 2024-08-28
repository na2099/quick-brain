import React from 'react';
import styled from 'styled-components';

const FileUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 40px 0;
`;

const UploadBox = styled.div`
  width: 80%;
  height: 200px;
  background-color: #f8f9fa;
  border: 2px dashed #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const UploadText = styled.p`
  font-size: 1.2em;
  color: #666;
`;

const Button = styled.button`
  background-color: #0a58ca;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1.1em;
  cursor: pointer;
`;

const FileUpload = () => {
  return (
    <FileUploadContainer>
      <UploadBox>
        <UploadText>Drag & Drop your file here</UploadText>
      </UploadBox>
      <Button>Generate Flashcards With Your PDF</Button>
    </FileUploadContainer>
  );
};

export default FileUpload;
