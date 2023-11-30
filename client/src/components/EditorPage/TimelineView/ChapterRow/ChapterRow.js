import React from 'react';
import './ChapterRow.css';

function ChapterRow({ index, chapter, chaptersOptions, updateViewField, lastRowIndex }) {
  let isLastRow = index === lastRowIndex;

  return (
    <div className="scrollable-cell subsection-row">
      {!isLastRow ? (
        <select
          value={chapter === 0 ? ' ' : chaptersOptions[chapter]}
          className="subsection-dropdown"
          onChange={(e) => updateViewField(index, 'chapter', e.target.value)}
        >
          {chaptersOptions.map((ch, i) => (
            <option key={i} value={ch}>
              {ch}
            </option>
          ))}
        </select>
      ) : (
        <span className="subsection-end-text">End</span>
      )}
    </div>
  );
}

export default ChapterRow;
