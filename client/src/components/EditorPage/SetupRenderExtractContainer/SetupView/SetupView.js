import React, { useState } from 'react';
import './SetupView.css';

function SetupView({ choreoData, setSetup, sequenceCompendium, promptsCompendium,
view, saveAndRefresh }) {

  const [localSetup, setLocalSetup] = useState({
    W: choreoData.W,
    H: choreoData.H,
    fps: choreoData.fps,
    scale: choreoData.scale,
    steps: choreoData.steps,
    seed: choreoData.seed
  });

  const handleLocalSetupChange = async (property, e) => {
    const newValue = parseInt(e.target.value, 10) || 0;
    const updatedSetup = { ...localSetup, [property]: newValue };
    setLocalSetup(updatedSetup);
    setSetup(updatedSetup);

    await saveAndRefresh({
      view,
      setup: updatedSetup,
      promptsCompendium,
      sequenceCompendium
  });
  }

  return (
    <div className="setup-view-container">
      <h2 className="setup-header">Setup</h2>
      <div className="setup-items-wrapper">
        <div className="setup-row">
          <div className="setup-item">
            <label>Width:</label>
            <input type="text" value={localSetup.W} onChange={(e) => handleLocalSetupChange('W', e)} maxLength={6} />
          </div>
          <div className="setup-item">
            <label>Height:</label>
            <input type="text" value={localSetup.H} onChange={(e) => handleLocalSetupChange('H', e)} maxLength={6} />
          </div>
          <div className="setup-item">
            <label>FPS:</label>
            <input type="text" value={localSetup.fps} onChange={(e) => handleLocalSetupChange('fps', e)} maxLength={6} />
          </div>
        </div>
        <div className="setup-row">
          <div className="setup-item">
            <label>Scale:</label>
            <input type="text" value={localSetup.scale} onChange={(e) => handleLocalSetupChange('scale', e)} maxLength={6} />
          </div>
          <div className="setup-item">
            <label>Steps:</label>
            <input type="text" value={localSetup.steps} onChange={(e) => handleLocalSetupChange('steps', e)} maxLength={6} />
          </div>
          <div className="setup-item">
            <label>Seed:</label>
            <input type="text" value={localSetup.seed} onChange={(e) => handleLocalSetupChange('seed', e)} maxLength={6} />
          </div>
        </div>
      </div>
    </div>

  );
}

export default SetupView;
