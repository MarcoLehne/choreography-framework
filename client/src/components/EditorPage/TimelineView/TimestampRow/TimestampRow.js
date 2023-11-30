import React, { useState, useEffect } from 'react';
import "./TimestampRow.css";

function TimestampRow({ index, timestamp, updateViewField }) {
  const [inputValue, setInputValue] = useState(timestamp);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setInputValue(timestamp);
  }, [timestamp]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setInputValue(value);
      setIsValid(true);
    }
  };

  const handleInputBlur = () => {
    
    if (isValid && inputValue !== timestamp) {
      updateViewField(index, 'timestamp', inputValue);
    } else {
      setIsValid(false);
    }
  };

  return (
    <div className="scrollable-cell subsection-row">
      <input 
        className={`subsection-textinput ${!isValid ? 'invalid-input' : ''}`}
        type="text" 
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
      />
    </div>
  );
}

export default TimestampRow;
