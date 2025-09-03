import React, { useState } from 'react';
import './ResumeUpload.css';

const ResumeUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setSelectedFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="resume-upload-container">
      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <span className="upload-text">
          {selectedFile ? selectedFile.name : 'Drag & Drop Resume (PDF) or Click Button Below'}
        </span>
        <button className="upload-button" onClick={openModal}>
          Upload Resume
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Upload Your Resume</h2>
            <label htmlFor="resume-upload" className="modal-label">
              <span className="modal-upload-text">Choose a PDF file</span>
              <input
                type="file"
                id="resume-upload"
                accept="application/pdf"
                className="modal-upload-input"
                onChange={handleFileChange}
              />
            </label>
            <div className="modal-buttons">
              <button className="modal-button modal-button-confirm" onClick={closeModal}>
                Confirm
              </button>
              <button className="modal-button modal-button-cancel" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;