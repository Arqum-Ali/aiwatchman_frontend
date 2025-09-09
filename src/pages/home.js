import React, { useState, useRef } from "react";

export default function ImageUpload() {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [previewURLs, setPreviewURLs] = useState([]);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    // Preview URLs
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewURLs(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setMessage("Please select an image first.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    try {
      setStatus("uploading");
      const response = await fetch("http://127.0.0.1:5000/identify-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setStatus("success");

        if (data.results && data.results.length > 0) {
          const names = data.results.map(
            (r) => `${r.person} (${(r.similarity * 100).toFixed(2)}%)`
          );
          setMessage(`Identified: ${names.join(", ")}`);
        } else {
          setMessage("No face recognized.");
        }
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
      <h2>Upload an Image</h2>
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

      {/* Preview */}
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

      {message && <p>{message}</p>}
    </div>
  );
}
