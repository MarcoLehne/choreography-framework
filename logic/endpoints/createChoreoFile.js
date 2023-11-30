const fs = require('fs').promises;
const path = require('path');

async function createChoreoFile(dirname, sessionId, formData) {

  const directoryPath = path.join(dirname, '..', `/uploads/${sessionId}`);
  
  try {
    await fs.mkdir(directoryPath);

    setTimeout(async () => {
      try {
        await fs.rm(directoryPath, { recursive: true });
        console.log(`Directory deleted: ${directoryPath}`);
      } catch (error) {
        console.error(`Error deleting directory ${directoryPath}:`, error);
      }
    }, 86400000); 

  } catch (err) {
  }

  try {
  
    let sequence_compendium;
    let prompts;

    try {
        const sequenceCompendiumData = await fs.readFile(path.join(directoryPath, "sequence_compendium.json"), 'utf8');
        sequence_compendium = JSON.parse(sequenceCompendiumData);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('sequence_compendium.json not found, setting default value.');
            sequence_compendium = [];
        } else {
            throw error;
        }
    }

    try {
        const promptsData = await fs.readFile(path.join(directoryPath, "prompts.json"), 'utf8');
        prompts = JSON.parse(promptsData);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('prompts.json not found, setting default value.');
            prompts = {};
        } else {
            throw error;
        }
    }

    let onlyValues = [];
    let valueIndices = new Map();

    Object.values(prompts).forEach((value, index) => {
      if (!valueIndices.has(value)) {
        valueIndices.set(value, onlyValues.length);
        onlyValues.push(value);
      }
    });

    formData.view = [];

    for (const timestamp of formData.timestamps) {
      const promptValue = prompts[timestamp];
      const promptIndex = promptValue !== undefined ? valueIndices.get(promptValue) : 0;

      formData.view.push({
        timestamp: timestamp.toString().trim(),
        chapter: 0,
        sequence: 0,
        prompt: promptIndex,
      });
    }

    formData.sequence_compendium = sequence_compendium || {};

    formData.prompts = onlyValues;

    formData.width = 512;
    formData.height = 512;
    formData.fps = 25;
    formData.scale = 20;
    formData.steps = 15
    formData.seed = 10000;
    
    const jsonString = JSON.stringify(formData, null, 2);

    await fs.writeFile(directoryPath + `/${formData.name}.choreo`, jsonString, 'utf8');
    
    console.log(`JSON data has been written to ${directoryPath}`);
    return 'success';
  } catch (error) {
    console.error('An error occurred while writing JSON to file:', error);
    return 'errorWritingFile';
  }
}

module.exports = createChoreoFile;