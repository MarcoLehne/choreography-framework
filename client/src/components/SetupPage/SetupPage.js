import React, { useState } from 'react';
import ChoreoForm from './ChoreoForm/ChoreoForm';
import UploadField from './UploadField';
import "./SetupPage.css";

function SetupPage({ sessionId, refreshEditorPage }) {
    const [choreoUploaded, setChoreoUploaded] = useState(false);
    const [choreoCreated, setChoreoCreated] = useState(false);
    const [showChoreoForm, setShowChoreoForm] = useState(false);

    const handleCreateChoreoClick = () => {
        setShowChoreoForm(true);
    };

    const handleChoreoUploadSuccess = () => {
        setShowChoreoForm(false);
        refreshEditorPage();
    };

    const handleChoreoCreationSuccess = () => {
        setChoreoCreated(true);
    };

    return (
        <div className="setup-page-container">
            {!showChoreoForm && !choreoUploaded && (
                <div className="options-wrapper">
                    <div className="create-choreo-button-container">
                        <button className="create-choreo-button" onClick={handleCreateChoreoClick}>
                            Create new .choreo file
                        </button>
                    </div>
                    <div className="upload-choreo-container">
                        <UploadField 
                            sessionId={sessionId}
                            fileType=".choreo"
                            onUploadSuccess={handleChoreoUploadSuccess} 
                        />
                    </div>
                </div>
            )}
            {showChoreoForm && (
                <ChoreoForm
                    sessionId={sessionId}
                    choreoCreated={choreoCreated}
                    setShowChoreoForm={setShowChoreoForm}
                    onChoreoCreationSuccess={handleChoreoCreationSuccess}
                    refreshEditorPage={refreshEditorPage}
                />
            )}
            {choreoUploaded && (
                <div className="upload-success-message">
                    .choreo file successfully uploaded.
                </div>
            )}
        </div>
    );
}

export default SetupPage;
