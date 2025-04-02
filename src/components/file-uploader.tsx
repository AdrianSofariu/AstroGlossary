"use client";

import { useState, useEffect } from "react";

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [downloadLinks, setDownloadLinks] = useState<string[]>([]);

  useEffect(() => {
    // Fetch all uploaded files on component mount
    const fetchFiles = async () => {
      try {
        const response = await fetch(
          `${process.env.API_CONNECTION_STRING}/files`
        );
        if (response.ok) {
          const data = await response.json();
          setDownloadLinks(data.files); // Store all file paths
        }
      } catch (error) {
        console.error("Failed to fetch files:", error);
      }
    };

    fetchFiles();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${process.env.API_CONNECTION_STRING}/files/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      const data = await response.json();
      setDownloadLinks((prevLinks) => [...prevLinks, data.filePath]); // Append new file to list
      alert("File uploaded successfully!");
    } else {
      alert("File upload failed!");
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Upload a File</h2>
      <input type="file" onChange={handleFileChange} className="mb-2" />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Upload
      </button>

      {downloadLinks.length > 0 && (
        <div className="mt-4">
          <h3 className="text-md font-bold">Download Uploaded Files:</h3>
          <ul className="list-disc pl-5 mt-2">
            {downloadLinks.map((link, index) => {
              const fileName = link.split("/").pop();
              return (
                <li key={index}>
                  <a
                    href={`${process.env.API_CONNECTION_STRING}/download/${link}`}
                    download
                    className="text-blue-500 underline"
                  >
                    {fileName}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
