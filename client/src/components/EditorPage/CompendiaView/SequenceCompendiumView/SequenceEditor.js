import React from 'react';
import './SequenceEditor.css';

function SequenceEditor({ sequenceData, onSave, onClose }) {
  const [editedSequence, setEditedSequence] = React.useState(JSON.stringify(sequenceData, null, 2));

  const handleSave = () => {
    onSave(JSON.parse(editedSequence));
    onClose();
  };

  return (
    <div className="sequence-editor-overlay">
      <div className="sequence-editor-header">
        <h2>{sequenceData.name}</h2>
        <button className="save-button" onClick={handleSave}>Save</button>
      </div>
      <textarea
        className="sequence-editor-textarea"
        value={editedSequence}
        onChange={(e) => setEditedSequence(e.target.value)}
      ></textarea>
    </div>
  );
}

export default SequenceEditor;
