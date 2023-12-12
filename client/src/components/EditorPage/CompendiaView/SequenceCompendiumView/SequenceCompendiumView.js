import React, { useState } from 'react';
import SequenceEditor from './SequenceEditor';
import './SequenceCompendiumView.css';

function SequenceCompendiumView({ saveAndRefresh, promptsCompendium, view, sequenceCompendium, setSequenceCompendium, sessionId, setup}) {
  const [sequenceInput, setSequenceInput] = useState('');
  const [editingSequence, setEditingSequence] = useState(null);

  const openSequenceEditor = (sequence, index) => {
    setEditingSequence({ sequence, index });
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

  const handleIndividualDelete = async (index) => {
    const indexInt = parseInt(index);
    const updatedSequences = sequenceCompendium.filter((_, seqIndex) => seqIndex !== indexInt);
  
    const updatedView = view.map(item => {
      if (item.sequence > indexInt + 1) { 
        return { ...item, sequence: item.sequence - 1 };
      } else if (item.sequence === indexInt + 1) {
        return { ...item, sequence: 0 }; 
      }
      return item;
    });
  
    setSequenceCompendium(updatedSequences);
  
    await saveAndRefresh({
      view: updatedView,
      setup,
      promptsCompendium,
      sequenceCompendium: updatedSequences
    });
  };
  
  const handleSequenceSave = async (index, updatedSequence) => {
    try {
      const updatedSequences = [...sequenceCompendium];
      updatedSequences[index] = updatedSequence;
  
      setSequenceCompendium(updatedSequences);
  
      await saveAndRefresh({
        view,
        setup,
        promptsCompendium,
        sequenceCompendium: updatedSequences
      });
  
      closeEditor();
    } catch (error) {
      console.error('Error updating sequence:', error);
    }
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
        <span className="header-item delete"></span>
        <span className="header-item scrollbar"></span>
      </div>
      <div className="sequence-compendium-list">
        {sequenceCompendium.length > 0 ? (
          sequenceCompendium.map((sequence, index) => (
            <div key={index} className="sequence-compendium-item">
              <span className="sequence-item sequence-compendium-index">{index}</span>
              <span className="sequence-item sequence-compendium-name">{sequence.name}</span>
              <span className="sequence-item sequence-compendium-camera-motions">{sequence.total_amount_camera_motions}</span>
              <button className="sequence-item sequence-edit-button" onClick={() => openSequenceEditor(sequence, index)}>Edit</button>
              <button className="sequence-item sequence-delete-button" onClick={() => handleIndividualDelete(index)}>Delete</button>
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
        </div>
      </div>
      {editingSequence && (
        <SequenceEditor
          sequenceData={editingSequence.sequence}
          index={editingSequence.index}
          onSave={handleSequenceSave}
          onClose={closeEditor}
        />
      )}
    </div>
  );
}

export default SequenceCompendiumView;