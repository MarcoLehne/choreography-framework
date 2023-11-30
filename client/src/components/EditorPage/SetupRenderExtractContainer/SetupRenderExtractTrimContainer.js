import React from 'react';
import ExtractTrimView from './ExtractTrimView/ExtractTrimView';
import SetupView from './SetupView/SetupView';
import RenderView from './RenderView/RenderView';
import './SetupRenderExtractTrimContainer.css';

function SetupRenderExtractTrimContainer({choreoData, setWidth, setHeight, setFps, setScale, setSteps, 
  setSeed, view, sessionId, setSetup, setup,
  sequenceCompendium, promptsCompendium, saveAndRefresh}) {
  return (
    <div className="setup-render-extract-container">
      <ExtractTrimView
        sessionId={sessionId}
      />
      <SetupView 
        choreoData={choreoData} 
        setWidth={setWidth} 
        setHeight={setHeight} 
        setFps={setFps} 
        setScale={setScale} 
        setSteps={setSteps} 
        setSeed={setSeed}
        setSetup={setSetup}
        setup={setup}
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
