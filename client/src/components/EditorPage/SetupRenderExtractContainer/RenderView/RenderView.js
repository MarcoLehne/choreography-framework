import React, { useState } from 'react';
import Modal from './Modal';
import './RenderView.css';

function RenderView({ view, setup, sequenceCompendium, promptsCompendium, saveAndRefresh, sessionId }) {

  let viewClone = view.map((x) => x);

  viewClone.pop();

  const [fromTimestampIndex, setFromTimestampIndex] = useState(0);
  const [toTimestampIndex, setToTimestampIndex] = useState(viewClone.length - 1);
  const [forOption, setForOption] = useState('colab');
  const [modal, setModal] = useState("");

  const handleSettingsDownloadClick = async () => {

    let errorString = isTimestampsOk(fromTimestampIndex, toTimestampIndex, view);
    errorString += isSequenceOk(fromTimestampIndex, toTimestampIndex, view, sequenceCompendium);
    errorString += isPromptsOk(fromTimestampIndex, toTimestampIndex, view, promptsCompendium);
    
    if (errorString === "") {
      await saveAndRefresh({
        view,setup,sequenceCompendium, promptsCompendium
      });

      fetch(`/downloadSettings`, {
        method: 'GET',
        headers: {
          'X-Session-ID': sessionId,
          'From-Timestamp-Index': fromTimestampIndex,
          'To-Timestamp-Index': toTimestampIndex,
          'for-webui-or-colab': forOption
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
        a.download = 'settings.txt';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch(error => {
        console.error('Error during settings file download:', error);
      });
    } else {
      setModal(errorString);
    }
  };

  const handleCloseModal = () => {
    setModal(""); // Function to close the modal
  };

  return (
    <div className="render-view-container">
      <h2 className="render-header">Render</h2>
      <div className="settings-download-container">
        <div className="top-row">
          <div className="timestamp-dropdown from-timestamp">
            <label className="timestamp-label">From:</label>
            <select className="timestamp-select" value={fromTimestampIndex} onChange={e => setFromTimestampIndex(e.target.value)}>
              {viewClone.map((_, index) => (
                <option key={index} value={index}>
                  {viewClone[index].timestamp}
                </option>
              ))}
            </select>
          </div>
          <div className="timestamp-dropdown to-timestamp">
            <label className="timestamp-label">To (incl):</label>
            <select className="timestamp-select" value={toTimestampIndex} onChange={e => setToTimestampIndex(e.target.value)}>
              {viewClone.map((_, index) => (
                <option key={index} value={index}>
                  {viewClone[index].timestamp}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="bottom-row">
          <div className="option-dropdown">
            <label className="option-label">For:</label>
            <select className="option-select" value={forOption} onChange={e => setForOption(e.target.value)}>
              <option value="colab">Colab</option>
              <option value="webui">WebUI</option>
            </select>
          </div>
          <button className="download-settings-button" onClick={handleSettingsDownloadClick}>
            Render
          </button>
        </div>
      </div>
      <Modal show={modal !== ""} onClose={handleCloseModal}>
        <pre>{modal}</pre>
      </Modal>
    </div>

  );
}

function isTimestampsOk(fromTimestampIndex, toTimestampIndex, view) {
  let problems = "";

  const fromTimestamp = parseFloat(view[fromTimestampIndex].timestamp);
  const toTimestamp = parseFloat(view[toTimestampIndex].timestamp);

  if (isNaN(fromTimestamp) || isNaN(toTimestamp) || fromTimestamp >= toTimestamp) {
    problems += "- 'from' needs to be smaller than 'to'. \n\n";
  }

  for (let i = fromTimestampIndex; i <= toTimestampIndex + 1; i++) {
    const currentTimestamp = parseFloat(view[i].timestamp);
    const nextTimestamp = parseFloat(view[i + 1]?.timestamp); // Optional chaining for the last element

    if (isNaN(currentTimestamp)) {
      problems += "A timestamp in the specified range might not be a number\n\n";
      break;
    }
    if (i < toTimestampIndex && currentTimestamp >= nextTimestamp) {
      problems += "Not all timestamps are getting bigger in ascending order\n\n"
      break;
    }
    if (view[i].timestamp !== "" && !/^\d+(\.\d+)?$/.test(view[i].timestamp)) {
      problems += "Not all timestamps are in seconds.milliseconds format\n\n"
      break;
    }
  }

  return problems;
}

function isPromptsOk(fromTimestampIndex, toTimestampIndex, view, promptsCompendium) {
  let problems = "";
  let promptDefinedAtFrom = false;
  let lastDefinedPromptBeforeFrom = "";

  // Iterate through the view array from the start to toTimestampIndex
  for (let i = 0; i <= toTimestampIndex; i++) {
    const promptIndex = view.at(i).prompt - 1; // -1 because prompt indices in view are 1-based

    if (promptIndex >= 0 && promptIndex < promptsCompendium.length) {
      const prompt = promptsCompendium[promptIndex].trim();

      if (i <= fromTimestampIndex && prompt !== "") {
        if (i === fromTimestampIndex) {
          promptDefinedAtFrom = true;
        }
        lastDefinedPromptBeforeFrom = prompt;
      }

      // Check if any prompt within the range is an empty string
      if (prompt === "" && i >= fromTimestampIndex) {
        problems += `Empty prompt found at index ${i}. \n\n`;
      }
    }
  }

  // Add a problem message if no prompt is defined at fromTimestampIndex and last defined prompt before fromTimestampIndex is empty
  if (!promptDefinedAtFrom && lastDefinedPromptBeforeFrom === "") {
    problems += "No prompt defined at 'from' or before. \n\n";
  }

  return problems;
}


function isSequenceOk(fromTimestampIndex, toTimestampIndex, view, sequenceCompendium) {
  let problems = "";

  if (view[fromTimestampIndex].sequence === 0) {
    problems += "No sequence defined at the starting timestamp. \n\n";
  }

  let sequenceCoverage = 0;
  for (let i = fromTimestampIndex; i <= toTimestampIndex && sequenceCoverage <= toTimestampIndex; i++) {
    const sequenceIndex = view[i].sequence - 1;

    if (sequenceIndex >= 0 && sequenceIndex < sequenceCompendium.length) {
      const sequenceLength = parseInt(sequenceCompendium[sequenceIndex].total_amount_camera_motions, 10);
      sequenceCoverage += sequenceLength;
      i += sequenceLength - 1;
    } else {
      problems += `Invalid sequence index at timestamp index ${i}. \n\n`;
      break;
    }
  }

  if (sequenceCoverage < toTimestampIndex) {
    problems += "The specified range is not fully covered by the sequences. \n\n";
  }

  return problems;
}

export default RenderView;