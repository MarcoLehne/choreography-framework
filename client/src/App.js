import React, { useState, useEffect } from 'react';
import SetupPage from './components/SetupPage/SetupPage';
import EditorPage from './components/EditorPage/EditorPage';
import MobileWarning from './components/MobileWarning';
import './App.css';

function App() {
    const [sessionId, setSessionId] = useState('');
    const [showEditorPage, setShowEditorPage] = useState(false);
    const [choreoData, setChoreoData] = useState(null);
    const [view, setView] = useState(null);
    const [promptsCompendium, setPromptsCompendium] = useState(null);
    const [sequenceCompendium, setSequenceCompendium] = useState(null);
    const [setup, setSetup] = useState(null);

    useEffect(() => {
        const newSessionId = generateSessionId();
        setSessionId(newSessionId);
    }, []);

    const generateSessionId = () => {
        return Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    };
    const refreshEditorPage = async () => {
        try {
            const response = await fetch('/getChoreoData', {
                method: 'GET',
                headers: {
                    'X-Session-ID': sessionId
                }
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            setChoreoData(data);
            setView(data.view);
            setPromptsCompendium(data.prompts);
            setSequenceCompendium(data.sequence_compendium);
            setSetup({
                "width": data.width, 
                "height": data.height, 
                "fps": data.fps, 
                "scale": data.scale, 
                "steps": data.steps, 
                "seed": data.seed
            });
            setShowEditorPage(true);
        } catch (error) {
            console.error('Error fetching choreo data:', error);
        }
    };
    
    const saveAndRefresh = async (dataToSend) => {
        try {
            const response = await fetch('/postChoreoUpdate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-ID': sessionId
                },
                body: JSON.stringify(dataToSend)
            });
    
            const data = await response.json();
            if (data.message === `success`) {
                await refreshEditorPage();
            } else {
                console.error('unexpected error posting update');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    

    const handleDownloadClick = async () => {

        await saveAndRefresh({
            view,setup,sequenceCompendium, promptsCompendium
        });

        fetch(`/downloadChoreoFile`, {
          method: 'GET',
          headers: {
            'X-Session-ID': sessionId
          }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.blob();
        })
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${choreoData.name}.choreo`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        })
        .catch(error => {
          console.error('Error during file download:', error);
        });
      };

    const handleLinkClick = () => {
        window.open('https://chat.openai.com/g/g-Upo80DFld-sequence-builder', '_blank');
    }

    const handleCopyPasteClick = async () => {
        try {
            const response = await fetch('/provideCopyPaste');
            const text = await response.text();
    
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(text);
                alert('Instructions copied to clipboard!');
            } else {
                console.error('Clipboard not available');
            }
        } catch (error) {
            console.error('Failed to copy:', error);
        }

    };
    

    const isMobile = window.innerWidth <= 768;

    return (
        <div className="app-container">
            <header className="app-header">
                <h1 className="app-title">Choreography</h1>
                <div className="project-name-display">{choreoData?.name}</div>
                
                {showEditorPage ? (
                    <div className="button-wrapper">
                        <button className="download-project-button" onClick={handleCopyPasteClick}>copy paste instructions</button>
                        <button className="download-project-button" onClick={handleLinkClick}>Sequence Builder</button>
                        <button className="download-project-button" onClick={handleDownloadClick}>Download</button>
                    </div>
                ) : null}
            </header>

            {isMobile ? (
                <MobileWarning />
            ) : !showEditorPage ? (
                    <SetupPage 
                        sessionId={sessionId}
                        refreshEditorPage={refreshEditorPage}
                    />
                ) : (
                    <EditorPage 
                        sessionId={sessionId}
                        choreoData={choreoData}  
                        view={view}
                        setup={setup}
                        setSetup={setSetup}
                        setView={setView}
                        promptsCompendium={promptsCompendium}
                        setPromptsCompendium={setPromptsCompendium}
                        sequenceCompendium={sequenceCompendium}
                        setSequenceCompendium={setSequenceCompendium}
                        refreshEditorPage={refreshEditorPage}
                        saveAndRefresh={saveAndRefresh}
                    />
                )
            }
            <footer className="app-footer">
                Developed by Marco Lehne 2023
            </footer>
        </div>
    );
}

export default App;
