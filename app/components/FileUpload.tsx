import React, { useState } from 'react';
import styled from 'styled-components';

interface UploadBoxProps {
  isDragging: boolean;
}

const FileUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 40px 0;
`;

const UploadBox = styled.div<UploadBoxProps>`
  width: 80%;
  height: 200px;
  background-color: #f8f9fa;
  border: 2px dashed #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  ${(props) => props.isDragging && 'background-color: #e2e6ea;'}
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
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      console.log('Files dropped:', files);
      // You can now process the files (e.g., read the PDF, send to backend, etc.)
    }
  };

  const handleFileUpload = () => {
    // Logic for handling file upload via button click
    console.log('Button clicked for file upload');
  };

  return (
    <FileUploadContainer>
      <UploadBox
        isDragging={isDragging}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <UploadText>Drag & Drop your file here</UploadText>
      </UploadBox>
      <Button onClick={handleFileUpload}>Generate Flashcards With Your PDF</Button>
    </FileUploadContainer>
  );
};

export default FileUpload;