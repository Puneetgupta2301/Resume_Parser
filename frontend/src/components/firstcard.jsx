// import React, { useState, useEffect } from "react";
// import "../styles/FirstCard.css";

// const FirstCard = () => {
//   const [text, setText] = useState("");
//   const [matchPercentage, setMatchPercentage] = useState(null);
//   const [predictedRole, setPredictedRole] = useState("");

//   // ✅ Fetch JD text when component loads
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("http://127.0.0.1:8000/get_data");
//         if (!response.ok) throw new Error("Failed to fetch data");
//         const data = await response.json();
//         setText(data.text);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setText("Error fetching data from API.");
//       }
//     };

//     fetchData();
//   }, []);

//   // ✅ Save JD to backend
//   const handleSaveJD = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("jd", text);

//       const response = await fetch("http://127.0.0.1:8000/set_job_description", {
//         method: "POST",
//         body: formData,
//       });

//       const result = await response.json();
//       if (response.ok) {
//         alert("✅ Job Description saved successfully!");
//       } else {
//         alert("❌ Failed to save Job Description.");
//       }
//     } catch (error) {
//       console.error("Error saving JD:", error);
//       alert("⚠️ Error saving JD. Please try again.");
//     }
//   };

//   // ✅ Handle file upload
//   const handleFileUpload = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await fetch("http://127.0.0.1:8000/upload_doc", {
//         method: "POST",
//         body: formData,
//       });
//       const result = await response.json();

//       if (response.ok) {
//         setMatchPercentage(result.match_percentage);
//         setPredictedRole(result.predicted_role);
//       } else {
//         alert("❌ Failed to upload file.");
//       }
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       alert("⚠️ Error uploading file. Please try again.");
//     }
//   };

//   return (
//     <div className="resume-container">
//       {/* ✅ Editable Job Description */}
//       <div className="jd-container">
//         <h3>Job Description</h3>
//         <textarea
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           rows={8}
//           style={{ width: "100%", padding: "10px" }}
//         />
//         <button onClick={handleSaveJD} className="save-btn">
//           Save JD
//         </button>
//       </div>

//       {/* ✅ Upload Resume */}
//       <div className="button-container">
//         <label className="upload-btn">
//           Upload Resume
//           <input
//             type="file"
//             style={{ display: "none" }}
//             onChange={handleFileUpload}
//           />
//         </label>
//       </div>

//       {/* ✅ Show results */}
//       {matchPercentage !== null && (
//         <div className="results-box">
//           <p><strong>Predicted Role:</strong> {predictedRole}</p>
//           <p><strong>Match Percentage:</strong> {matchPercentage}%</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FirstCard;

import React, { useState, useEffect } from "react";
import "../styles/FirstCard.css";

const FirstCard = () => {
  const [text, setText] = useState("");
  const [matchPercentage, setMatchPercentage] = useState(null);
  const [predictedRole, setPredictedRole] = useState("");

  // Fetch JD text when component loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/get_data");
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setText(data.text);
      } catch (error) {
        console.error("Error fetching data:", error);
        setText("Error fetching data from API.");
      }
    };

    fetchData();
  }, []);

  // Save JD to backend
  const handleSaveJD = async () => {
    try {
      const formData = new FormData();
      formData.append("jd", text);

      const response = await fetch("http://127.0.0.1:8000/set_job_description", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert("✅ Job Description saved successfully!");
      } else {
        alert("❌ Failed to save Job Description.");
      }
    } catch (error) {
      console.error("Error saving JD:", error);
      alert("⚠️ Error saving JD. Please try again.");
    }
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload_doc", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (response.ok) {
        setMatchPercentage(result.match_percentage);
        setPredictedRole(result.predicted_role);
      } else {
        alert("❌ Failed to upload file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("⚠️ Error uploading file. Please try again.");
    }
  };

  return (
    <div className="resume-container">
      {/* Editable Job Description */}
      <div className="jd-container">
        <h3 className="jd-title">Job Description</h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter or edit job description..."
          className="jd-textarea"
        />
        <button onClick={handleSaveJD} className="save-btn">
          Save JD
        </button>
      </div>

      {/* Upload File Button */}
      <div className="upload-container">
        <label className="upload-btn">
          Upload File
          <input
            type="file"
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
        </label>
      </div>

      {/* Results Display */}
      {matchPercentage !== null && (
        <div className="results-box">
          <h4 className="results-title">Analysis Results</h4>
          <p className="result-item"><strong>Predicted Role:</strong> {predictedRole}</p>
          <p className="result-item"><strong>Match Percentage:</strong> {matchPercentage}%</p>
        </div>
      )}
    </div>
  );
};

export default FirstCard;