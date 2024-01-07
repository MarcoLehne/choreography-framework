import React from 'react';
import PromptsCompendiumView from './PromptsCompendiumView/PromptsCompendiumView';
import SequenceCompendiumView from './SequenceCompendiumView/SequenceCompendiumView';
import './CompendiaView.css';

function CompendiaView({ promptsCompendium, sequenceCompendium, setPromptsCompendium, setSequenceCompendium, view, saveAndRefresh, setup }) {
  return (
    <div className="compendia-view expandable-child">
      <PromptsCompendiumView
        view={view}
        saveAndRefresh={saveAndRefresh}
        promptsCompendium={promptsCompendium}
        setPromptsCompendium={setPromptsCompendium}
      />
      <SequenceCompendiumView
        view={view}
        saveAndRefresh={saveAndRefresh}
        sequenceCompendium={sequenceCompendium}
        setSequenceCompendium={setSequenceCompendium}
      />
    </div>
  );
}

export default CompendiaView;
