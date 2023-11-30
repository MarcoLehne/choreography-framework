import React, { useState } from 'react';
import './ChoreoForm.css';

function ChoreoForm({ sessionId, onChoreoCreationSuccess, choreoCreated, refreshEditorPage }) {
    const [name, setName] = useState("my_default_batch");
    const [timestamps, setTimestamps] = useState([0,1,2,3,4,5,6,7,8,9,10]);
    const [isCreationSuccessful, setIsCreationSuccessful] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(true);
   
    const handleSubmit = () => {
        const choreoData = { name, timestamps };
    
        fetch('/createChoreoFile', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-Session-ID': sessionId
            },
            body: JSON.stringify(choreoData)
        })
        .then(response => {
            if (response.status === 200) {
                return response.json().then(data => {
                    if (data.message === "success") {
                        refreshEditorPage();
                        setIsCreationSuccessful(true);
                        setIsFormVisible(false);
                    } else {
                        console.error('File creation message not as expected:', data.message);
                    }
                });
            } else {
                console.error('Non-200 response status:', response.status);
                throw new Error('File creation was not successful');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    return (
        <div className={`choreo-form-container ${isCreationSuccessful ? 'form-successful' : ''}`}>
            {isFormVisible && (
                <div className="form-fields">
                    <div className="form-field">
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} />
                    </div>

                    <div className="form-field">
                        <label htmlFor="timestamps">Timestamps:</label>
                        <input type="text" id="timestamps" value={timestamps.join(',')} onChange={e => setTimestamps(e.target.value.split(','))} />
                    </div>
                    <button 
                        className="go-to-editor-button"
                        onClick={handleSubmit}
                    >
                        Create {name}.choreo and go to Editor
                    </button>
                </div>
            )}
        </div>
    );
}    

export default ChoreoForm;