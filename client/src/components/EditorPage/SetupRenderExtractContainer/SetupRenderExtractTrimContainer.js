import React from 'react';
import ExtractTrimView from './ExtractTrimView/ExtractTrimView';
import SetupView from './SetupView/SetupView';
import RenderView from './RenderView/RenderView';
import './SetupRenderExtractTrimContainer.css';

function SetupRenderExtractTrimContainer({choreoData, setW, setH, setFps, setScale, setSteps, 
  setSeed, view, sessionId, setSetup, setup,
  sequenceCompendium, promptsCompendium, saveAndRefresh}) {
  return (
    <div className="setup-render-extract-container">
      {/* <ExtractTrimView
        sessionId={sessionId}
      /> */}
      <SetupView 
        choreoData={choreoData} 
        setW={setW} 
        setH={setH} 
        setFps={setFps} 
        setScale={setScale} 
        setSteps={setSteps} 
        setSeed={setSeed}
        setSetup={setSetup}
        setup={setup}
        saveAndRefresh={saveAndRefresh}
        sequenceCompendium={sequenceCompendium}
        promptsCompendium={promptsCompendium}
        view={view}
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
