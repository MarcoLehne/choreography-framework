const fs = require('fs').promises;
const path = require('path');

async function updateChoreoFile(dirname, sessionId, updateData) {
  
  const directoryPath = path.join(dirname, '..', 'uploads', sessionId);

  try {
    const files = await fs.readdir(directoryPath);
    const choreoFile = files.find(file => file.endsWith('.choreo'));

    if (!choreoFile) {
      throw new Error('No .choreo file found');
    }

    const filePath = path.join(directoryPath, choreoFile);
    const fileContent = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(fileContent);

    jsonData.view = counterCheckView(updateData.view, updateData.promptsCompendium, updateData.sequenceCompendium);
    jsonData.prompts = updateData.promptsCompendium;
    jsonData.sequence_compendium = updateData.sequenceCompendium; 
    jsonData.width = updateData.setup.width;
    jsonData.height = updateData.setup.height;
    jsonData.scale = updateData.setup.scale;
    jsonData.steps = updateData.setup.steps;
    jsonData.fps = updateData.setup.fps;
    jsonData.seed = updateData.setup.seed;
    
    await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8');

    return 'success';
  } catch (error) {
    console.error('Failed to update choreo file:', error);
    throw error;
  }
}

function counterCheckView(view, promptsCompendium, sequenceCompendium) {
  return view.map(item => {
    let updatedItem = { ...item };
    if (updatedItem.sequence > sequenceCompendium.length) {
      updatedItem.sequence = 0;
    }
    if (updatedItem.prompt > promptsCompendium.length) {
      updatedItem.prompt = 0;
    }
    return updatedItem;
  });
}

module.exports = updateChoreoFile;