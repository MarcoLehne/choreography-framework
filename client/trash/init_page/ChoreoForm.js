import React, { useState } from 'react';
import './ChoreoForm.css';

function ChoreoForm({ sessionId, setShowForm, setShowTimelineEditor, setTimelineData }) {
    const [name, setName] = useState("my_default_batch");
    const [scale, setScale] = useState(20);
    const [steps, setSteps] = useState(15);
    const [width, setWidth] = useState(512);
    const [height, setHeight] = useState(512);
    const [seed, setSeed] = useState(10000);
    const [fps, setFps] = useState(25);
    const [timestamps, setTimestamps] = useState([0,1,2,3,4,5,6,7,8,9,10]);
    const [isCreationSuccessful, setIsCreationSuccessful] = useState(false);

    const handleSubmit = () => {
        const choreoData = { name, scale, steps, width, height, seed, fps, timestamps };
    
        fetch('/createChoreoFile', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-Session-ID': sessionId
            },
            body: JSON.stringify(choreoData)
        })
        .then(response => {
            if (response.status === 200) {
                return response.json().then(data => {
                    if (data.message === `creation of ${name}.choreo was successful`) {
                        setIsCreationSuccessful(true);
                    } else {
                        // Handle different response message
                        console.error('File creation message not as expected:', data.message);
                    }
                });
            } else {
                // Handle non-200 response
                console.error('Non-200 response status:', response.status);
                throw new Error('File creation was not successful');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    return (
        <div className={`choreo-form ${isCreationSuccessful ? 'form-successful' : ''}`}>
          <label>
              Name:
              <input type="text" value={name} onChange={e => setName(e.target.value)} />
          </label>

          <label>
              Scale:
              <select value={scale} onChange={e => setScale(e.target.value)}>
                  {[...Array(30).keys()].map(n => <option key={n+1} value={n+1}>{n+1}</option>)}
              </select>
          </label>

          <label>
              Steps:
              <select value={steps} onChange={e => setSteps(e.target.value)}>
                  {[...Array(30).keys()].map(n => <option key={n+1} value={n+1}>{n+1}</option>)}
              </select>
          </label>

          <label>
              Width (W):
              <input type="number" value={width} onChange={e => setWidth(e.target.value)} />
          </label>

          <label>
              Height (H):
              <input type="number" value={height} onChange={e => setHeight(e.target.value)} />
          </label>

          <label>
              Seed:
              <input type="number" value={seed} onChange={e => setSeed(e.target.value)} />
          </label>

          <label>
              FPS:
              <select value={fps} onChange={e => setFps(e.target.value)}>
                  {[...Array(120).keys()].map(n => <option key={n+1} value={n+1}>{n+1}</option>)}
              </select>
          </label>
          <label>
                Timestamps:
                <input type="text" value={timestamps.join(',')} onChange={e => setTimestamps(e.target.value.split(','))} />
            </label>

            <button onClick={handleSubmit}>Create {name}.choreo</button>
        </div>
    );
}

export default ChoreoForm;
