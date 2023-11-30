import React from 'react';
import './PromptsCompendiumView.css';

function PromptsCompendiumView({ view, sequenceCompendium, promptsCompendium, setPromptsCompendium, saveAndRefresh, setup }) {
  
  const handleTextChange = (index, newText) => {
    const updatedPrompts = [...promptsCompendium];
    updatedPrompts[index] = newText;
    setPromptsCompendium(updatedPrompts);
  };
  
  const handleAddPrompt = async () => {    
    const updatedPrompts = [...promptsCompendium, ''];
    setPromptsCompendium(updatedPrompts);

    await saveAndRefresh({
        view,
        setup,
        promptsCompendium: updatedPrompts,
        sequenceCompendium
    });
};

const handleDeleteLastPrompt = async () => {
    const updatedPrompts = [...promptsCompendium].slice(0, -1);
    setPromptsCompendium(updatedPrompts);

    await saveAndRefresh({
        view,
        setup,
        promptsCompendium: updatedPrompts,
        sequenceCompendium
    });
};


  return (
    <div className="prompts-compendium-view expandable-child">
      <h2 className="prompts-compendium-header">Prompts Compendium</h2>
      <div className="prompts-compendium-header-row">
        <span className="header-item index">Index</span>
        <span className="header-item name">Name</span>
        <span className="header-item edit"></span>
        <span className="header-item scrollbar"></span>
      </div>
      <div className="prompts-compendium-list">
        {promptsCompendium.length > 0 ? (
          promptsCompendium.map((prompt, index) => (
            <div key={index} className="prompt-compendium-item">
              <span className="prompts-compendium-index prompt-item">{index}</span>
              <input
                type="text"
                className="prompt-compendium-input prompt-item"
                value={prompt}
                onChange={e => handleTextChange(index, e.target.value)}
              />
            </div>
          ))
        ) : (
          <p className="no-prompts-message">No prompts available.</p>
        )}
      </div>
      <div className="add-delete-prompt-button-container">
        <button className="add-prompt-button" onClick={handleAddPrompt}>
          Add Prompt
        </button>
        <button className="delete-last-prompt-button" onClick={handleDeleteLastPrompt}>
          Delete Last
        </button>
      </div>
    </div>
  );
}

export default PromptsCompendiumView;
