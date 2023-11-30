const fs = require('fs').promises;
const path = require('path');

async function getChoreoData(sessionId, dirname) {
  const directoryPath = path.join(dirname, '..', `uploads/${sessionId}`);

  try {
    const files = await fs.readdir(directoryPath);
    const choreoFile = files.find(file => file.endsWith('.choreo'));
    
    if (!choreoFile) {
      throw new Error('No .choreo file found');
    }

    const choreoFilePath = path.join(directoryPath, choreoFile);
    const data = await fs.readFile(choreoFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting choreo data:', error);
    throw error;
  }
}

module.exports = getChoreoData;
