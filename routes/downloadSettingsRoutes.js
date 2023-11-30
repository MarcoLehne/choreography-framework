const express = require('express');
const path = require('path');
const router = express.Router();
const createSettingsFile = require('../logic/endpoints/createSettingsFile');
const fs = require('fs');

router.get('/downloadSettings', async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const fromTimestamp = req.headers['from-timestamp-index'];
  const toTimestamp = req.headers['to-timestamp-index'];
  const forWebuiOrColab = req.headers['for-webui-or-colab']
  const directoryPath = path.join(__dirname, '..', 'uploads', sessionId);

  await createSettingsFile(fromTimestamp, toTimestamp, forWebuiOrColab, directoryPath, sessionId);

  let filePath = path.join(directoryPath, 'settings.txt');

  if (fs.existsSync(filePath)) {
      res.download(filePath, 'settings.txt', (err) => {
          if (err) {
              console.error('Error in file download:', err);
              res.status(500).send('Error in downloading file');
          } else {
              setTimeout(() => {
                  try {
                      fs.rm(path.join(__dirname, 'uploads', sessionId), { recursive: true, force: true }, (err) => {
                          if (err) console.error('Error during cleanup:', err);
                      });
                  } catch (cleanupError) {
                      console.error('Error during cleanup:', cleanupError);
                  }
              }, 10000);
          }
      });
  } else {
      res.status(404).send('File not found');
  }
});

module.exports = router;