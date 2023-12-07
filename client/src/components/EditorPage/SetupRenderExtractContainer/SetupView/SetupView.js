import React, { useState, useEffect } from 'react';
import './SetupView.css';

function SetupView({ choreoData, setW, setH, setFps, setScale, setSteps, setSeed, setSetup, setup }) {
  
  const [W, setLocalW] = useState(choreoData.W);
  const [H, setLocalH] = useState(choreoData.H);
  const [fps, setLocalFps] = useState(choreoData.fps);
  const [scale, setLocalScale] = useState(choreoData.scale);
  const [steps, setLocalSteps] = useState(choreoData.steps);
  const [seed, setLocalSeed] = useState(choreoData.seed);

  useEffect(() => {
    setLocalW(choreoData.W);
    setLocalH(choreoData.H);
    setLocalFps(choreoData.fps);
    setLocalScale(choreoData.scale);
    setLocalSteps(choreoData.steps);
    setLocalSeed(choreoData.seed);
  }, [choreoData]);

  const handleWChange = (e) => {
    const newW = parseInt(e.target.value, 10) || 0;
    setLocalW(newW);
    setW(newW);

    setSetup(prevSetup => {
      return {
        ...prevSetup,
        W: newW
      };
    });
  };

  const handleHChange = (e) => {
    const newH = parseInt(e.target.value, 10) || 0;
    setLocalH(newH);
    setH(newH);

    setSetup(prevSetup => {
      return {
        ...prevSetup,
        H: newH
      };
    });
  };

  const handleFpsChange = (e) => {
    const newFps = parseInt(e.target.value, 10) || 0;
    setLocalFps(newFps);
    setFps(newFps);

    setSetup(prevSetup => {
      return {
        ...prevSetup,
        fps: newFps
      };
    });
  };

  const handleScaleChange = (e) => {
    const newScale = parseInt(e.target.value, 10) || 0;
    setLocalScale(newScale);
    setScale(newScale);

    setSetup(prevSetup => {
      return {
        ...prevSetup,
        scale: newScale
      };
    });
  };

  const handleStepsChange = (e) => {
    const newSteps = parseInt(e.target.value, 10) || 0;
    setLocalSteps(newSteps);
    setSteps(newSteps);

    setSetup(prevSetup => {
      return {
        ...prevSetup,
        steps: newSteps
      };
    });
  };

  const handleSeedChange = (e) => {
    const newSeed = parseInt(e.target.value, 10) || 0;
    setLocalSeed(newSeed);
    setSeed(newSeed);

    setSetup(prevSetup => {
      return {
        ...prevSetup,
        seed: newSeed
      };
    });
  };

  return (
    <div className="setup-view-container">
      <h2 className="setup-header">Setup</h2>
      <div className="setup-items-wrapper">
        <div className="setup-row">
          <div className="setup-item">
            <label>Width:</label>
            <input type="text" value={W} onChange={handleWChange} maxLength={6} />
          </div>
          <div className="setup-item">
            <label>Height:</label>
            <input type="text" value={H} onChange={handleHChange} maxLength={6} />
          </div>
          <div className="setup-item">
            <label>FPS:</label>
            <input type="text" value={fps} onChange={handleFpsChange} maxLength={6} />
          </div>
        </div>
        <div className="setup-row">
          <div className="setup-item">
            <label>Scale:</label>
            <input type="text" value={scale} onChange={handleScaleChange} maxLength={6} />
          </div>
          <div className="setup-item">
            <label>Steps:</label>
            <input type="text" value={steps} onChange={handleStepsChange} maxLength={6} />
          </div>
          <div className="setup-item">
            <label>Seed:</label>
            <input type="text" value={seed} onChange={handleSeedChange} maxLength={6} />
          </div>
        </div>
      </div>
    </div>

  );
}

export default SetupView;
