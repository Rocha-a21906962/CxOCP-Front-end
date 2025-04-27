import React, { useState } from 'react';
import { FaCloudUploadAlt, FaFileCsv, FaCheck, FaArrowLeft } from "react-icons/fa";
import { useHistory } from 'react-router-dom';
import './FileUploader.css';

const FileUploader = () => {
  const [files, setFiles] = useState([]);
  const history = useHistory();

  // Function to handle file upload
  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0]; // Assume only one file is selected
    const newFile = {
      name: uploadedFile.name,
      size: uploadedFile.size,
      status: 'uploading',
      progress: 0
    };

    // Simulate upload progress
    setTimeout(() => {
      newFile.status = 'uploaded';
      newFile.progress = 100;
      setFiles([...files, newFile]);
    }, 2000); // Simulating a 2-second upload process
  };

  // Function to handle back navigation
  const handleBack = () => {
    history.goBack();
  };

  return (
    <div className="wrapper">
      <header>
        <FaArrowLeft className="back-arrow" onClick={handleBack} />
        Upload Process
      </header>
      <form>
        <label htmlFor="fileInput">
          <i><FaCloudUploadAlt className="upload-icon" /></i>
          <p>Browse File to Upload</p>
        </label>
        <input
          id="fileInput"
          type="file"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </form>

      <section className="progress-area">
        {files.map((file, index) => (
          <li key={index} className="progress-row">
            <i><FaFileCsv className="file-icon" /></i>
            <div className="progress-content">
              <div className="progress-details">
                <span className="progress-file-name">{file.name} • {file.status === 'uploading' ? 'Uploading' : 'Uploaded'}</span>
                {file.status === 'uploading' && <span className="percent">{file.progress}%</span>}
                {file.status === 'uploaded' && <span className="size">{file.size / 1000} KB</span>}
              </div>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${file.progress}%` }}></div>
              </div>
            </div>
            {file.status === 'uploaded' && <FaCheck className="check-icon" />}
          </li>
        ))}
      </section>
    </div>
  );
};

export default FileUploader;
