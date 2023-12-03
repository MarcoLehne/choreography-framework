const express = require('express');
const fs = require('fs').promises; // Use the promise version of the fs module for async/await
const path = require('path');
const router = express.Router();

router.get('/provideCopyPaste', async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../sequence_builder_GPT.txt');

    const fileContents = await fs.readFile(filePath, 'utf8');

    res.send(fileContents);
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).send('Error reading file');
  }
});

module.exports = router;
