import React from 'react';

function SequenceRow({ index, sequence, sequence_compendium, invisibleSequenceIndices, sequencesOptions, updateViewField, lastRowIndex }) {
  let isLastRow = index === lastRowIndex;
  let hideNextSelect = invisibleSequenceIndices.has(index);

  const selectValue = hideNextSelect ? sequencesOptions[0] : (sequence === 0 ? ' ' : sequencesOptions[sequence]);

  return (
    <div className={`scrollable-cell subsection-row ${hideNextSelect ? 'hidden' : ''}`}>
      {!isLastRow ? (
        <select
          value={selectValue}
          className={`subsection-dropdown ${hideNextSelect ? 'hidden' : ''}`}
          onChange={(e) => updateViewField(index, 'sequence', e.target.value)}
          disabled={hideNextSelect}
        >
          {sequencesOptions.map(seq => (
            <option key={seq} value={seq}>
              {seq}
            </option>
          ))}
        </select>
      ) : (
        <span className="subsection-end-text"></span>
      )}
    </div>
  );
}

export default SequenceRow;
