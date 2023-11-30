import React from 'react';
import './UploadChoreoFile.css';

function UploadChoreoFile() {
    return (
        <div className="upload-choreo-option">
            <div>Upload existing .choreo file</div>
            <input type="file" onChange={(event) => {/* logic to handle file upload */}} />
            <button onClick={() => {/* logic to upload file */}}>Upload</button>
        </div>
    );
}
 
export default UploadChoreoFile;