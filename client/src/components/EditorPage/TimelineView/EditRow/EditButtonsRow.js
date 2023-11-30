import React from 'react';
import "./EditButtonsRow.css"

function EditButtonsRow({ index, setView,
  view,
  setup,
  sequenceCompendium,
  promptsCompendium,
  saveAndRefresh }) {
    
    const handleAddTimestamp = async () => {
      const newTimestamp = {
        timestamp: '',
        chapter: 0,
        sequence: 0,
        prompt: 0
      };
    
      let updatedView;
      setView(prevView => {
        updatedView = [...prevView];
        updatedView.splice(index + 1, 0, newTimestamp);
        return updatedView;
      });
    
      // Wait for the next render to ensure the state has been updated
      await new Promise(resolve => setTimeout(resolve, 0));
    
      await saveAndRefresh({
        view: updatedView,
        setup,
        promptsCompendium,
        sequenceCompendium
      });
    };
    
    
    const handleRemoveTimestamp = async () => {
      setView(prevView => {
        const updatedView = [...prevView];
        if (updatedView.length > 1) {
          updatedView.splice(index, 1);
        }
        return updatedView;
      });
    
      // Wait for the next render to ensure the state has been updated
      await new Promise(resolve => setTimeout(resolve, 0));
    
      await saveAndRefresh({
        view: view.filter((_, idx) => idx !== index),
        setup,
        promptsCompendium,
        sequenceCompendium
      });
    };
    


  return (
    <div className="scrollable-cell edit-buttons-cell subsection-row">
      {(index > 0 && view.length > 2) && 
        <button className="edit-button delete" onClick={handleRemoveTimestamp}>-</button>
      }
      <button className="edit-button add" onClick={handleAddTimestamp}>+</button>
    </div>
  );
}


export default EditButtonsRow;
