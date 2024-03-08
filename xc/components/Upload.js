import React, { useState } from "react";
import { FileDrop } from "react-file-drop";

export default function Upload({ children, onUploadFinish }) {
  const [isFileNearby, setIsFileNearby] = useState(false);
  const [isFileOver, setIsFileOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  async function uploadImage(files, e) {
    e.preventDefault();
    setIsFileNearby(false);
    setIsFileOver(false);
    setIsUploading(true);
    const data = new FormData();
    data.append("post", files[0]);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
      const json = await response.json();
      const src = json.src;
      onUploadFinish(src);
    } catch (error) {
      console.error("Error uploading image:", error);
      // Handle the error state accordingly
    } finally {
      setIsUploading(false);
    }
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
        {children({ isUploading })}
      </div>
    </FileDrop>
  );
}