import React, { useState, useRef } from 'react';
import './UploadField.css';

function UploadField({ fileType, sessionId, onUploadSuccess, isSuccessful }) {
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleDragLeave = (e) => {
        if (!isSuccessful) {
            e.currentTarget.classList.remove('dragover');
        }
    };

    const handleDrop = (e) => {
        if (!isSuccessful) {
            e.preventDefault();
            e.currentTarget.classList.remove('dragover');
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile) {
                uploadFile(droppedFile);
            }
        }
    };

    const handleFileChange = (e) => {
        if (!isSuccessful) {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
                uploadFile(selectedFile);
            }
        }
    };

    const uploadFile = (selectedFile) => {
        const formData = new FormData();
        formData.append('file', selectedFile);

        fetch('/uploadChoreoFile', {
            method: 'POST',
            headers: { 
                'X-Session-ID': sessionId
            },
            body: formData,
        })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('File upload failed');
            }
        })
        .then(data => {
            if (data.message === `success`) {
                onUploadSuccess();
                setFile(selectedFile);
            } else {
                console.error('Unexpected response message');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    const conditionalPreventDefault = (e) => {
        if (!isSuccessful) {
            e.preventDefault();
            e.currentTarget.classList.add('dragover');
        }
    };


    const openFileSelector = () => {
        fileInputRef.current.click();
    };

    return (
        <div 
            className={`upload-field ${isSuccessful ? 'successful' : ''}`}
            onDragOver={conditionalPreventDefault}
            onDragLeave={isSuccessful ? null : handleDragLeave}
            onDrop={isSuccessful ? null : handleDrop}
            onClick={isSuccessful ? null : openFileSelector}>
            <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={isSuccessful ? null : handleFileChange} 
                accept={fileType} 
                disabled={isSuccessful}
            />
            {file ? (
                <p>{file.name} uploaded successfully</p>
            ) : (
                <p>Drag and drop a {fileType} file here, or click to select a file</p>
            )}
        </div>
    );
}

export default UploadField;
