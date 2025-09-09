import React, { useState, useRef } from "react";

export default function UploadReferences() {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [previewURLs, setPreviewURLs] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | uploading | success | error
  const [message, setMessage] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    // Preview URLs
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewURLs(urls);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setMessage("Please select at least one image.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file)); // 👈 match Flask key

    try {
      setStatus("uploading");
      const response = await fetch("http://127.0.0.1:5000/upload-references", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setStatus("success");
        setMessage(data.message); // Flask returns {"message": "..."}
      } else {
        setStatus("error");
        setMessage("Upload failed.");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("An error occurred.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Upload Reference Images</h2>
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
        <br />
        <br />
        <button type="submit">Upload</button>
      </form>

      {/* Preview selected images */}
      <div style={{ marginTop: "20px" }}>
        {previewURLs.map((url, index) => (
          <img
            key={index}
            src={url}
            alt="preview"
            style={{ width: "150px", margin: "10px", borderRadius: "8px" }}
          />
        ))}
      </div>

      {status === "uploading" && <p>Uploading...</p>}
      {message && <p>{message}</p>}
    </div>
  );
}
