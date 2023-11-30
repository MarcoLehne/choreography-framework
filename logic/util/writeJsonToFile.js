const fs = require('fs').promises;

async function writeJsonToFile(jsonObject, filePath) {
  try {
    // Convert the JSON object to a string with pretty-printing
    const jsonString = JSON.stringify(jsonObject, null, 2);
    
    // Write the JSON string to the file at the given path
    await fs.writeFile(filePath, jsonString, 'utf8');
    
    console.log(`JSON data has been written to ${filePath}`);
  } catch (error) {
    console.error('An error occurred while writing JSON to file:', error);
  }
}


module.exports = writeJsonToFile;