const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const processVideo = require('../logic/endpoints/processVideo');
const videoUploadRouter = express.Router();

const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const sessionId = req.headers['x-session-id'];
    const dest = path.join(__dirname, '..', 'uploads', sessionId);
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.random().toString(36).substring(2);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const videoUpload = multer({ storage: videoStorage });

videoUploadRouter.post('/uploadVideo', videoUpload.single('video'), async (req, res) => {
  try {
    const videoFilePath = path.join(__dirname, '..', 'uploads', req.headers['x-session-id'], req.file.filename);
    console.log(videoFilePath);
    const result = await processVideo(videoFilePath);
    console.log(`Video processed: ${result}`);
    res.json({ message: "success" });
  } catch (error) {
    console.error('Error processing video:', error);
    res.status(500).json({ message: "error" });
  }
});

module.exports = videoUploadRouter;
