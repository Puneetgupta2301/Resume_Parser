import React, { useState, useEffect } from "react";
import "../styles/FirstCard.css";

const FirstCard = () => {
  const [text, setText] = useState("");

  // ✅ Fetch data automatically when component loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/get_data");
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setText(data.text); // ✅ show only the text field
      } catch (error) {
        console.error("Error fetching data:", error);
        setText("Error fetching data from API.");
      }
    };

    fetchData();
  }, []);

  // ✅ Handle file upload
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
        alert(`✅ ${file.name} uploaded successfully!`);
      } else {
        alert("❌ Failed to upload file.");
      }

      console.log(result);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("⚠️ Error uploading file. Please try again.");
    }
  };

  return (
    <div className="resume-container">
      <div className="resume-textbox">
        <pre>{text}</pre> {/* ✅ preserves newlines */}
      </div>
      <div className="button-container">
        <label className="upload-btn">
          Upload Resume
          <input
            type="file"
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
        </label>
      </div>
    </div>
  );
};

export default FirstCard;
