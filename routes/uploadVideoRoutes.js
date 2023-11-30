const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const processVideo = require('../logic/endpoints/processVideo');
const videoUploadRouter = express.Router();

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const videoUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const sessionId = req.headers['x-session-id'];
      const uniqueSuffix = Date.now() + '-' + Math.random().toString(36).substring(2);
      const filename = `videos/${sessionId}/video-${uniqueSuffix}${path.extname(file.originalname)}`;
      cb(null, filename);
    }
  })
});

videoUploadRouter.post('/uploadVideo', videoUpload.single('video'), async (req, res) => {
  try {
    const videoKey = req.file.key;
    console.log(videoKey);
    const result = await processVideo(s3, videoKey);
    console.log(`Video processed: ${result}`);
    res.json({ message: "success" });
  } catch (error) {
    console.error('Error processing video:', error);
    res.status(500).json({ message: "error" });
  }
});

module.exports = videoUploadRouter;
