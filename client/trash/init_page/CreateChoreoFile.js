import React from 'react';
import './CreateChoreoFile.css';

function CreateChoreoFile({ onCreateChoreoClick }) {
    return (
        <div className="create-choreo-option">
            <button onClick={onCreateChoreoClick}>Create a new .choreo file</button>
        </div>
    );
}

export default CreateChoreoFile;
