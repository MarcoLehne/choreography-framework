import React, { useState, useRef, useEffect } from 'react';
import './UploadSequenceField.css';

function UploadSequenceField({ saveAndRefresh, setSequenceCompendium, sequenceCompendium }) {
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                try {
                    const json = JSON.parse(text);
                    const updatedSequenceCompendium = [...sequenceCompendium, json];
                    setSequenceCompendium(updatedSequenceCompendium);
                    setFile(selectedFile);
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }
            };
            reader.readAsText(selectedFile);
        }
    };


    // useEffect(() => {
    //     saveAndRefresh();
    //   }, [sequenceCompendium]);

    const openFileSelector = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="upload-field">
            <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileChange} 
                accept="application/json" 
            />
            <div 
                className="upload-area" 
                onClick={openFileSelector}
            >
                {file ? (
                    <p>{file.name} uploaded successfully</p>
                ) : (
                    <p>Drag and drop a JSON file here, or click to select a file</p>
                )}
            </div>
        </div>
    );
}

export default UploadSequenceField;
