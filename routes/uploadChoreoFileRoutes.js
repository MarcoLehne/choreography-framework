const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const sessionId = req.headers['x-session-id']; 
      const dest = path.join(__dirname, '..') + `/uploads/${sessionId}`;
      fs.mkdirSync(dest, { recursive: true });
      cb(null, dest);
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/uploadChoreoFile', upload.single('file'), (req, res) => {
  console.log(`Received file: ${req.file.originalname} for session: ${req.headers['x-session-id']}`);
  res.json({ message: "success"});
});

module.exports = router;