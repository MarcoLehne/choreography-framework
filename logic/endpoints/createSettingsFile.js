const processUserInput = require('../util/processUserInput');
const mergeJson = require('../util/mergeJson');
const writeJsonToFile = require('../util/writeJsonToFile');
const path = require('path');
const fs = require('fs').promises;

async function createSettingsFile(fromTimestamp, toTimestamp, forWebuiOrColab, directoryPath, session_id) {
  try {
    const files = await fs.readdir(directoryPath);
    const choreoFile = files.find(file => file.endsWith('.choreo'));

    if (!choreoFile) {
      console.error('No .choreo file found');
      return 'failure';
    }

    const choreoFilePath = path.join(directoryPath, choreoFile);
    const data = await fs.readFile(choreoFilePath, 'utf8');
    const choreoObject = JSON.parse(data);

    processUserInput(fromTimestamp, toTimestamp, choreoObject);

    let settings = require('../util/template_settings.json');
    mergeJson(settings, choreoObject);

    await writeJsonToFile(settings, path.join(directoryPath, 'settings.txt'));

    return 'success';
  } catch (error) {
    console.error('Error in createSettingsFile:', error);
    return 'failure';
  }
}

module.exports = createSettingsFile;
