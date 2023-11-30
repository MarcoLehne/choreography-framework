import React from 'react';

function PromptRow({ index, prompt, promptsOptions, updateViewField, lastRowIndex}) {

  let isLastRow = index === lastRowIndex;

  return (
    <div className="scrollable-cell subsection-row">
    {!isLastRow ? (
      <select
        value={prompt === 0 ? ' ' : promptsOptions[prompt]}
        className="subsection-dropdown"
        onChange={(e) => updateViewField(index, 'prompt', e.target.value)}
      >
        {promptsOptions.map(prmpt => (
          <option key={prmpt} value={prmpt}>
            {prmpt}
          </option>
        ))}
      </select>
      ) : (
        <span className="subsection-end-text"></span>
      )}
    </div>
  );
}

export default PromptRow;
