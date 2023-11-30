import React, { useState } from 'react';
import SequenceEditor from './SequenceEditor';
import './SequenceCompendiumView.css';

function SequenceCompendiumView({ saveAndRefresh, promptsCompendium, view, sequenceCompendium, setSequenceCompendium, sessionId, setup}) {
  const [sequenceInput, setSequenceInput] = useState('');
  const [editingSequence, setEditingSequence] = useState(null);

  const openSequenceEditor = (sequence) => {
    setEditingSequence(sequence);
  };
  
  const handleAddSequence = async () => {
    if (sequenceInput.trim()) {
        try {
            const sequenceData = JSON.parse(sequenceInput);
            const updatedSequences = [...sequenceCompendium, sequenceData];

            setSequenceCompendium(updatedSequences);
            setSequenceInput('');

            await saveAndRefresh({
                view,
                setup,
                promptsCompendium,
                sequenceCompendium: updatedSequences
            });
        } catch (error) {
            console.error('Invalid JSON format:', error);
        }
    } else {
    }
  };

  const handleSequenceDelete = async () => {
      const updatedSequences = [...sequenceCompendium].slice(0, -1);
      setSequenceCompendium(updatedSequences);

      await saveAndRefresh({
          view,
          setup,
          promptsCompendium,
          sequenceCompendium: updatedSequences
      });
  };


  const handleSequenceSave = (updatedSequence) => {
    closeEditor();
  };
  
  const closeEditor = () => {
    setEditingSequence(null);
  };

  return (
    <div className="sequence-compendium-view  expandable-child">
      <h2 className="sequence-compendium-header">Sequence Compendium</h2>
      <div className="sequence-compendium-header-row">
        <span className="header-item index">Index</span>
        <span className="header-item name">Name</span>
        <span className="header-item length">Length</span>
        <span className="header-item edit"></span>
        <span className="header-item scrollbar"></span>
      </div>
      <div className="sequence-compendium-list">
        {sequenceCompendium.length > 0 ? (
          sequenceCompendium.map((sequence, index) => (
            <div key={index} className="sequence-compendium-item">
              <span className="sequence-item sequence-compendium-index">{index}</span>
              <span className="sequence-item sequence-compendium-name">{sequence.name}</span>
              <span className="sequence-item sequence-compendium-camera-motions">{sequence.total_amount_camera_motions}</span>
              <button className="sequence-item sequence-edit-button" onClick={() => openSequenceEditor(sequence)}>Edit</button>
            </div>
          ))
        ) : (
          <p className="no-sequences-message">No sequences available.</p>
        )}
      </div>
      <div className="sequence-input-wrapper">
        <textarea
          className="sequence-input-textarea"
          value={sequenceInput}
          onChange={(e) => setSequenceInput(e.target.value)}
          placeholder="Copy paste your sequence here"
        />
        <div className="send-delete-div">
          <button className="sequence-input-send-button" onClick={handleAddSequence}>Add sequence</button>
          <button className="sequence-delete-button" onClick={handleSequenceDelete}>Delete last</button>
        </div>
      </div>
      {editingSequence && (
        <SequenceEditor
          sequenceData={editingSequence}
          onSave={handleSequenceSave}
          onClose={closeEditor}
        />
      )}
    </div>
  );
}

export default SequenceCompendiumView;