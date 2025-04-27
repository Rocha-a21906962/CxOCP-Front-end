import React, { useState, useRef } from 'react';
import axios from "axios";
import { FaCloudUploadAlt, FaFileCsv, FaCheck } from "react-icons/fa";
import { Button, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import './FileUploader.css';

const FileUploader = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const [progress, setProgress] = useState(0);  // Track upload progress
  const [processData, setProcessData] = useState(null);  // Store the process data

  const handleFormClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      console.log('Selected file:', selectedFile.name);
      setFile(selectedFile);

      // Trigger upload animation
      uploadFile(selectedFile);
    } else {
      console.log('No file selected');
    }
  };

  // This function triggers the upload animation
  const uploadFile = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    // Simulate progress animation
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 10;
      setProgress(progress);

      if (progress >= 100) {
        clearInterval(progressInterval);
        setUploading(false);
        setUploadCompleted(true);
      }
    }, 120); // Update progress every 120ms

    // Temporarily just simulate the upload animation without calling API
  };

  // Trigger the actual API call and toast notification
  const handleFinishUpload = async () => {
    if (!uploadCompleted) return;

    // Make the axios call to upload the file
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/v1/process/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        // Assume response contains the process data
        const process = response.data.process;

        // Set the process data to state
        setProcessData(process);

        // Show success toast
        toast({
          title: "Upload Complete",
          description: `${file.name} uploaded successfully!`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Remove the ".csv" extension from the file name
        const fileNameWithoutExtension = file.name.slice(0, -4);

        // Log the file name without extension before navigating
        console.log("Navigating to /chat with process data:", fileNameWithoutExtension);

        // Navigate to /chat with the modified process name
        navigate('/chat', { state: { processData: fileNameWithoutExtension } });

      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "There was a problem uploading the file.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="wrapper">
      <header>Upload Process</header>

      <form action="#" className="file-upload-form" onClick={handleFormClick}>
        <i><FaCloudUploadAlt className="upload-icon" /></i>
        <p>Browse File to Upload</p>
        <input
          type="file"
          ref={fileInputRef}
          className="process-input"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept=".csv"
        />
      </form>

      <section className="progress-area">
        {file && (
          <li className="progress-row">
            <i><FaFileCsv className="file-icon" /></i>
            <div className="progress-content">
              <div className="progress-details">
                <span className="progress-file-name">{file.name} • {progress < 100 ? "Uploading" : "Uploaded"}</span>
                {progress < 100 && <span className="percent">{progress}%</span>}
              </div>

              {progress < 100 && (
                <div className="progress-bar">
                  <div className="progress" style={{ width: progress + '%' }}></div>
                </div>
              )}
            </div>
            {progress === 100 && <FaCheck className="check-icon" />}
          </li>
        )}
      </section>

      <Button
        colorScheme="teal"
        mt={6}
        width="100%"
        onClick={handleFinishUpload}
        isDisabled={!uploadCompleted}  // Enable only after upload is completed
        isLoading={uploading}
        loadingText="Saving..."
        variant={uploadCompleted ? "solid" : "outline"}
      >
        Complete Upload
      </Button>
    </div>
  );
};

export default FileUploader;
