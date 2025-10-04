import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import "../Styles/FirstCard.css"; // Assuming styles from FirstCard; add ResumeUpload.css if needed

//const API_URL = import.meta.env.VITE_API_URL;
const API_URL = "http://localhost:8000";  // Replace with your API URL

const FirstCard = () => {
  const { id } = useParams(); // Get the role ID from URL
  const [text, setText] = useState("");
  const [matchPercentage, setMatchPercentage] = useState(null);
  const [predictedRole, setPredictedRole] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Allowed file types
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'text/plain' // TXT
  ];

  const getFileIcon = (fileType) => {
    if (fileType === 'application/pdf') return '📄';
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return '📝';
    if (fileType === 'text/plain') return '📄';
    return '📎';
  };

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = document.querySelector('.jd-textarea');
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height
      textarea.style.height = Math.max(textarea.scrollHeight, 200) + 'px'; // Set to content height or min 200px
    }
  }, [text]);

  // Fetch JD text when component loads, using role ID
  useEffect(() => {
    if (!id) return; // Guard if no ID

    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/get_data?role=${encodeURIComponent(id)}`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setText(data.text || "No JD found for this role.");
      } catch (error) {
        console.error("Error fetching data:", error);
        setText("Error fetching data from API.");
      }
    };

    fetchData();
  }, [id]); // Re-fetch if ID changes

  // Handle file upload to backend (integrated) - assumes JD is role-specific
  const handleFileUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    if (id) formData.append("role", id); // Pass role if needed for backend

    try {
      const response = await fetch(`${API_URL}/upload_doc`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (response.ok) {
        setMatchPercentage(result.match_percentage);
        setPredictedRole(result.predicted_role);
        setSelectedFile(null); // Clear selection after upload
        alert("✅ File uploaded and analyzed successfully!");
      } else {
        alert("❌ Failed to upload file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("⚠️ Error uploading file. Please try again.");
    }
  };

  // Drag and drop handlers
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
    if (droppedFile && allowedTypes.includes(droppedFile.type)) {
      setSelectedFile(droppedFile);
      handleFileUpload(droppedFile); // Trigger upload immediately on drop
    } else if (droppedFile) {
      alert("❌ Please upload a valid file: PDF, DOCX, or TXT.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && allowedTypes.includes(file.type)) {
      setSelectedFile(file);
      // Don't auto-upload; wait for confirm in modal
    } else if (file) {
      alert("❌ Please select a valid file: PDF, DOCX, or TXT.");
      e.target.value = ''; // Clear invalid selection
    }
  };

  const handleConfirmUpload = () => {
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
    closeModal();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null); // Clear on close
  };

  return (
    <div className="resume-container">
      {/* Job Description Display (Read-Only) */}
      <div className="jd-container">
        <h3 className="jd-title">{id || 'Job Description'}</h3>
        <textarea
          value={text}
          placeholder="Enter or edit job description..."
          className="jd-textarea"
          readOnly
        />
      </div>

      {/* Enhanced Professional Upload Area */}
      <div className="upload-container">
        <div
          className={`upload-area ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          style={{
            border: dragActive ? '3px dashed #007bff' : '2px dashed #ccc',
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: dragActive ? '#f8f9ff' : '#fafafa',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ marginBottom: '1rem', fontSize: '3rem' }}>
            {dragActive ? '✨' : '📁'}
          </div>
          <span className="upload-text" style={{ display: 'block', marginBottom: '1rem', fontSize: '1.1rem', color: '#666' }}>
            {selectedFile ? (
              <>
                {getFileIcon(selectedFile.type)} {selectedFile.name}
              </>
            ) : (
              'Drag & Drop Your Resume Here'
            )}
          </span>
          <p style={{ margin: '0.5rem 0', color: '#999', fontSize: '0.9rem' }}>
            or
          </p>
          <button 
            className="upload-button" 
            onClick={openModal}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              boxShadow: '0 2px 4px rgba(0,123,255,0.25)'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
          >
            Browse Files
          </button>
          <p style={{ marginTop: '0.5rem', color: '#999', fontSize: '0.8rem' }}>
            Supports PDF, DOCX, TXT • Max 10MB
          </p>
        </div>

        {isModalOpen && (
          <div 
            className="modal-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
          >
            <div 
              className="modal-content"
              style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                maxWidth: '400px',
                width: '90%'
              }}
            >
              <h2 className="modal-title" style={{ marginBottom: '1rem', color: '#333' }}>
                Upload Your Resume
              </h2>
              <label htmlFor="resume-upload" className="modal-label">
                <span className="modal-upload-text" style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>
                  Choose a file (PDF, DOCX, TXT)
                </span>
                <input
                  type="file"
                  id="resume-upload"
                  accept={allowedTypes.join(',')}
                  className="modal-upload-input"
                  onChange={handleFileChange}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '2px dashed #ccc',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                />
              </label>
              {selectedFile && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '6px', fontSize: '0.9rem' }}>
                  <strong>Selected:</strong> {getFileIcon(selectedFile.type)} {selectedFile.name}
                </div>
              )}
              <div className="modal-buttons" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button 
                  className="modal-button modal-button-cancel" 
                  onClick={closeModal}
                  style={{
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="modal-button modal-button-confirm" 
                  onClick={handleConfirmUpload}
                  disabled={!selectedFile}
                  style={{
                    backgroundColor: selectedFile ? '#28a745' : '#ccc',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: selectedFile ? 'pointer' : 'not-allowed'
                  }}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Display */}
      {matchPercentage !== null && (
        <div className="results-box">
          <h4 className="results-title">Analysis Results</h4>
          <p className="result-item">
            <strong>Predicted Role:</strong> {predictedRole}
          </p>
          <p className="result-item">
            <strong>Match Percentage:</strong> {matchPercentage}%
          </p>
        </div>
      )}
    </div>
  );
};

export default FirstCard;