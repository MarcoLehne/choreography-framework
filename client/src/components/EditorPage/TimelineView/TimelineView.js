import React from 'react';
import ChapterRow from './ChapterRow/ChapterRow';
import TimestampRow from './TimestampRow/TimestampRow';
import SequenceRow from './SequenceRow/SequenceRow';
import PromptRow from './PromptRow/PromptRow';
import EditButtonsRow from './EditRow/EditButtonsRow';
import './TimelineView.css';

function TimelineView({ choreoData, setView,
  view,
  setup,
  sequenceCompendium,
  promptsCompendium,
  saveAndRefresh }) {

  const chaptersOptions = [' ', ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))];
  const sequencesOptions = [' '];
  const promptsOptions = [' '];
  
  const invisibleSequenceIndices = new Set();

  for (let i = 0; i < choreoData.view.length; i++) {
    const sequence = choreoData.view.at(i).sequence;
  
    if (sequence !== 0) {
      const totalCameraMotions = Number(choreoData.sequence_compendium[sequence - 1].total_amount_camera_motions);
      for (let ii = i + 1; ii < i + totalCameraMotions; ii++) {
        invisibleSequenceIndices.add(ii);
      }
      i += (totalCameraMotions - 1);
    }
  }
  if (Array.isArray(choreoData.sequence_compendium)) {
    sequencesOptions.push(...choreoData.sequence_compendium.map((_, index) => index.toString()));
  }
  
  if (Array.isArray(choreoData.prompts)) {
    promptsOptions.push(...choreoData.prompts.map((_, index) => index.toString()));
  }

  const updateViewField = (index, field, value) => {
    const updatedView = [...choreoData.view];

    let newValue = value;
    if (field === 'chapter') {
      newValue = value === ' ' ? 0 : chaptersOptions.indexOf(value);
    } else if (field === 'sequence' || field === 'prompt') {
      newValue = value === ' ' ? 0 : parseInt(value, 10) + 1;
    }

    updatedView[index][field] = newValue;
    setView(updatedView);
  };

  return (
    <div className="timeline-view">
      <h2 className="timeline-header">Timeline</h2>
      <div className="timeline-content">
        <div className="timeline-fixed-column">
          <div className="fixed-row-label">Chapter:</div>
          <div className="fixed-row-label">Timestamp:</div>
          <div className="fixed-row-label">Sequence:</div>
          <div className="fixed-row-label">Prompt:</div>
        </div>
        <div className="timeline-scrollable-section">
          {choreoData.view.map(({ timestamp, chapter, sequence, prompt }, index) => (
            <div key={index} className="scrollable-column">
              <ChapterRow 
                index={index} 
                chapter={chapter} 
                chaptersOptions={chaptersOptions} 
                updateViewField={updateViewField}
                lastRowIndex={choreoData.view.length - 1}
              />
              <TimestampRow  
                index={index} 
                timestamp={timestamp} 
                updateViewField={updateViewField}
              />
              <SequenceRow  
                index={index} 
                sequence={sequence} 
                sequence_compendium={choreoData.sequence_compendium}
                invisibleSequenceIndices={invisibleSequenceIndices}
                sequencesOptions={sequencesOptions} 
                updateViewField={updateViewField}
                lastRowIndex={choreoData.view.length - 1}
              />
              <PromptRow  
                index={index} 
                prompt={prompt} 
                promptsOptions={promptsOptions} 
                updateViewField={updateViewField}
                lastRowIndex={choreoData.view.length - 1}
              />
              <EditButtonsRow  
                index={index} 
                setView={setView}
                view={view}
                setup={setup}
                sequenceCompendium={sequenceCompendium}
                promptsCompendium={promptsCompendium}
                saveAndRefresh={saveAndRefresh}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TimelineView;
