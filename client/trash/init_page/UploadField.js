import React, { useState, useRef } from 'react';

function UploadField({ fileType, onUploadSuccess, isSuccessful }) {
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = event => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            uploadFile(selectedFile);
        }
    };

    const uploadFile = file => {
        const formData = new FormData();
        formData.append('file', file);

        fetch('/uploadInitFiles', {
            method: 'POST',
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
            if (data.message === `upload of ${file.name} successful`) {
                onUploadSuccess();
                setFile(file);
            } else {
                console.error('Unexpected response message');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    const handleDrop = event => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile) {
            uploadFile(droppedFile);
        }
    };

    const openFileSelector = () => {
        fileInputRef.current.click();
    };

    return (
        <div 
            className={`upload-field ${isSuccessful ? 'successful' : ''}`}
            onDragOver={event => event.preventDefault()}
            onDrop={handleDrop}
            onClick={openFileSelector}>
            <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileChange} 
                accept={fileType} 
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
