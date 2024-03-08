import React, { useState, useEffect } from "react";
import { FileDrop } from "react-file-drop";

export default function Upload({ children, onUploadFinish }) {
  const [isFileNearby, setIsFileNearby] = useState(false);
  const [isFileOver, setIsFileOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
 
    return () => {
      if (isUploading) {
        abortUpload();
      }
    };
  }, [isUploading]);

  async function uploadImage(files, e) {
    e.preventDefault();
    setIsFileNearby(false);
    setIsFileOver(false);
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    const data = new FormData();
    data.append("post", files[0]);

    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: data,
        signal, 
      });

      if (!response.ok) {
        throw new Error(`Failed to upload image (${response.status})`);
      }

      const json = await response.json();
      const src = json.src;
      onUploadFinish(src);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  }

  function abortUpload() {
    controller.abort();
    setIsUploading(false);
    setUploadError("Upload canceled");
  }

  return (
    <FileDrop
      onDrop={uploadImage}
      onDragOver={() => setIsFileOver(true)}
      onDragLeave={() => setIsFileOver(false)}
      onFrameDragEnter={() => setIsFileNearby(true)}
      onFrameDragLeave={() => setIsFileNearby(false)}
      onFrameDrop={() => {
        setIsFileNearby(false);
        setIsFileOver(false);
      }}
    >
      <div className="relative">
        {(isFileNearby || isFileOver) && (
          <div className="bg-twitterBlue absolute inset-0 flex items-center justify-center">
            drop your images here
          </div>
        )}
        {children({ isUploading, uploadProgress, uploadError, abortUpload })}
      </div>
    </FileDrop>
  );
}