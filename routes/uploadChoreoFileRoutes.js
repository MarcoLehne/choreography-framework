const express = require('express');
const multer = require('multer');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

module.exports = (s3) => {
    router.post('/uploadChoreoFile', upload.single('file'), async (req, res) => {
        const sessionId = req.headers['x-session-id']; 
        const file = req.file;

        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: `${sessionId}/${file.originalname}`,
            Body: file.buffer
        };

        try {
            const command = new PutObjectCommand(params);
            const data = await s3.send(command);
            console.log(`File uploaded successfully.`);
            await updateDirectoriesJson(s3, sessionId, new Date().toISOString());
            res.json({ message: "success", location: data.Location });
        } catch (err) {
            console.error("Error", err);
            res.status(500).send('Error uploading file');
        }
    });

    return router;
};