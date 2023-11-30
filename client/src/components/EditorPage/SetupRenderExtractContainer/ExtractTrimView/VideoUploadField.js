import React, { useState, useRef } from 'react';
import './VideoUploadField.css';

function VideoUploadField({ fileType, sessionId, onUploadSuccess }) {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('dragover');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            uploadFile(droppedFile);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            uploadFile(selectedFile);
        }
    };

    const uploadFile = (selectedFile) => {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('video', selectedFile);

        fetch('/uploadVideo', {
            method: 'POST',
            headers: { 
                'X-Session-ID': sessionId
            },
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'success') {
                onUploadSuccess();
                setFile(selectedFile);
            } else {
                console.error('Unexpected response message:', data.message);
            }
            setIsUploading(false);
        })
        .catch(error => {
            console.error('Error during file upload:', error);
            setIsUploading(false);
        });
    };

    const conditionalPreventDefault = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('dragover');
    };

    const openFileSelector = () => {
        fileInputRef.current.click();
    };

    return (
        <div 
            className={`video-upload-field ${isUploading ? 'uploading' : ''}`}
            onDragOver={conditionalPreventDefault}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFileSelector}>
            <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileChange} 
                accept={fileType} 
            />
            {isUploading ? (
                <p>Uploading...</p>
            ) : file ? (
                <p>{file.name} uploaded</p>
            ) : (
                <p>Drag and drop a {fileType} file here, or click to select a file</p>
            )}
        </div>
    );
}

export default VideoUploadField;
