import React, { useState, } from 'react';
import SetupRenderExtractTrimContainer from './SetupRenderExtractContainer/SetupRenderExtractTrimContainer';
import TimelineView from './TimelineView/TimelineView';
import CompendiaView from './CompendiaView/CompendiaView';
import './EditorPage.css';

function EditorPage({ choreoData, sessionId, view, setView, 
  promptsCompendium, setPromptsCompendium, sequenceCompendium, setSequenceCompendium, 
  saveAndRefresh, setup, setSetup }) {

  const [width, setWidth] = useState(choreoData.width);
  const [height, setHeight] = useState(choreoData.height)
  const [fps, setFps] = useState(choreoData.fps);
  const [scale, setScale] = useState(choreoData.scale);
  const [steps, setSteps] = useState(choreoData.steps);
  const [seed, setSeed] = useState(choreoData.seed);

  return (
    <div className="timeline-editor">
      <SetupRenderExtractTrimContainer 
        choreoData={choreoData} 
        setWidth={setWidth} 
        setHeight={setHeight} 
        setFps={setFps} 
        setScale={setScale} 
        setSteps={setSteps} 
        setSeed={setSeed}
        setup={setup}
        setSetup={setSetup}
        view={view}
        sequenceCompendium={sequenceCompendium}
        promptsCompendium={promptsCompendium}
        saveAndRefresh={saveAndRefresh}
        sessionId={sessionId}
      />
      <TimelineView 
        choreoData={choreoData} 
        setView={setView}
        view={view}
        setup={setup}
        sequenceCompendium={sequenceCompendium}
        promptsCompendium={promptsCompendium}
        saveAndRefresh={saveAndRefresh}
      />
      <CompendiaView 
        promptsCompendium={promptsCompendium}
        sequenceCompendium={sequenceCompendium}
        setPromptsCompendium={setPromptsCompendium}
        setSequenceCompendium={setSequenceCompendium}
        saveAndRefresh={saveAndRefresh}
        view={view}
        setup={setup}
      />
    </div>
  );
}

export default EditorPage;
