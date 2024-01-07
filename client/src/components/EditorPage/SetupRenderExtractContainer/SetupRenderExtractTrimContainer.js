import React from 'react';
import SetupView from './SetupView/SetupView';
import RenderView from './RenderView/RenderView';
import './SetupRenderExtractTrimContainer.css';

function SetupRenderExtractTrimContainer({choreoData, view, sessionId, setSetup, setup,
  sequenceCompendium, promptsCompendium, saveAndRefresh}) {
  return (
    <div className="setup-render-extract-container">
      <SetupView 
        choreoData={choreoData} 
        setSetup={setSetup}
        setup={setup}
        saveAndRefresh={saveAndRefresh}
      />
      <RenderView 
        view={view}
        setup={setup}
        sequenceCompendium={sequenceCompendium}
        promptsCompendium={promptsCompendium}
        saveAndRefresh={saveAndRefresh}
        sessionId={sessionId}
      />
    </div>
  );
}

export default SetupRenderExtractTrimContainer;
