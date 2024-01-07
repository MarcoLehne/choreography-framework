import React, { useState } from 'react';
import './SequenceCreator.css';

function SequenceEditor({ onSave, onClose }) {
  const [sequenceName, setSequenceName] = useState('');
  const [segments, setSegments] = useState([]);

  const handleAddSegment = () => {
    setSegments([...segments, { name: '', cameraMotions: 1 }]);
  };

  const handleSegmentChange = (index, field, value) => {
    const newSegments = [...segments];
    newSegments[index][field] = value;
    setSegments(newSegments);
  };

  const handleDeleteSegment = (index) => {
    setSegments(segments.filter((_, i) => i !== index));
  };

  const handleCopyToClipboard = () => {

    const defaultSequenceName = "Default Sequence Name";
    const defaultSegmentName = "Default Segment Name";
  

    const buildCameraMotion = () => ({
      axis: { "z": 0.1 },
      duration: {
        onset_duration: 0.2,
        peak_duration: 0.6,
        offset_duration: 0.3
      },
      anchor: {
        onset_anchor: { "2D": 0.1, "3D": 0.1, "meaning": "absolute" },
        offset_anchor: { "2D": 0.1, "3D": 0.1, "meaning": "absolute" }
      },
      graph: {
        onset_graph: "exponential",
        offset_graph: "exponential"
      }
    });
  
    const sequenceObject = {
      name: sequenceName || defaultSequenceName,
      values: segments.map((segment, index) => ({
        name: segment.name || `${defaultSegmentName} ${index + 1}`, 
        amount_camera_motions: segment.cameraMotions,
        camera_motions: Array.from({ length: segment.cameraMotions }, buildCameraMotion)
      }))
    };
  
    navigator.clipboard.writeText(JSON.stringify(sequenceObject, null, 2));
    onClose();
  };
  

  return (
    <div className="sequence-editor-overlay">
      <div className="sequence-editor-header">
        <h2>Edit Sequence</h2>
        <button className="copy-button" onClick={handleCopyToClipboard}>Copy to Clipboard and Close</button>
      </div>
      <div className="sequence-editor-content">
        <label>
          Name:
          <input className="globalName" type="text" value={sequenceName} onChange={(e) => setSequenceName(e.target.value)} />
        </label>
        <button className="add-button" onClick={handleAddSegment}>Add Segment</button>
        {segments.map((segment, index) => (
          <div key={index} className="segment-row">
            <input type="text" value={segment.name} onChange={(e) => handleSegmentChange(index, 'name', e.target.value)} placeholder="Segment Name" />
            <select value={segment.cameraMotions} onChange={(e) => handleSegmentChange(index, 'cameraMotions', e.target.value)}>
              {[...Array(10).keys()].map(n => <option key={n} value={n + 1}>{n + 1}</option>)}
            </select>
            <button className="delete-button" onClick={() => handleDeleteSegment(index)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SequenceEditor;
