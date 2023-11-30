function mapPrompts(fromTimestampIndex, toTimestampIndex, choreoObject) {
  
  let lastKnownPrompt = 0;

  for (let i = fromTimestampIndex; i >= 0; i--) {
    if (choreoObject.view.at(i).prompt !== 0) {
      lastKnownPrompt = choreoObject.view.at(i).prompt - 1;
      break;
    }
  }

  choreoObject.cond_prompts = {};
  for (let i = fromTimestampIndex; i <= toTimestampIndex; i++) {

    if (i === fromTimestampIndex && choreoObject.view.at(i).prompt === 0) {
      choreoObject.cond_prompts[choreoObject.view.at(i).timestamp] = choreoObject.prompts.at(lastKnownPrompt);
    } else {
      if (choreoObject.view.at(i).prompt !== 0) {
        choreoObject.cond_prompts[choreoObject.view.at(i).timestamp] = choreoObject.prompts.at(choreoObject.view.at(i).prompt - 1);
      }
    }
  }
}

module.exports = mapPrompts;